const db = require('../database/db');

// Безопасное добавление новых колонок для реалистичного чекаута
// Если колонки уже есть, SQLite просто проигнорирует ошибку
db.run("ALTER TABLE orders ADD COLUMN payment_method TEXT", () => {});
db.run("ALTER TABLE orders ADD COLUMN delivery_time TEXT", () => {});
db.run("ALTER TABLE orders ADD COLUMN comment TEXT", () => {});

const createOrder = (req, res) => {
    // Принимаем новые поля из реалистичного чекаута
    const { userId, address, items, paymentMethod, deliveryTime, comment } = req.body;

    if (!userId || !address || !items || items.length === 0) {
        return res.status(400).json({ error: "Не все обязательные поля заполнены" });
    }

    // Сохраняем адрес пользователя как дефолтный на будущее
    db.run('UPDATE users SET address = ? WHERE id = ?', [address, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const productIds = items.map(i => i.id);
        const placeholders = productIds.map(() => '?').join(',');

        // Считаем точную цену на стороне сервера (защита от махинаций)
        db.all(`SELECT id, price FROM products WHERE id IN (${placeholders})`, productIds, (err, products) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            let totalPrice = 0;
            const priceMap = {};
            products.forEach(p => {
                priceMap[p.id] = p.price;
            });

            items.forEach(item => {
                const price = priceMap[item.id] || 0;
                totalPrice += price * item.quantity;
            });

            // Создаем заказ с новыми реалистичными полями
            db.run(
                'INSERT INTO orders (user_id, address, total_price, payment_method, delivery_time, comment) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, address, totalPrice, paymentMethod || 'cash', deliveryTime || 'asap', comment || ''],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const orderId = this.lastID;
                    const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)');
                    
                    let completed = 0;
                    let hasError = false;

                    items.forEach(item => {
                        stmt.run(orderId, item.id, item.quantity, (runErr) => {
                            if (hasError) return;

                            if (runErr) {
                                hasError = true;
                                stmt.finalize();
                                return res.status(500).json({ error: runErr.message });
                            }

                            completed++;
                            if (completed === items.length) {
                                stmt.finalize();

                                // Очищаем корзину после успешного заказа
                                db.run('DELETE FROM cart WHERE user_id = ?', [userId], (cartErr) => {
                                    if (cartErr) {
                                        return res.status(500).json({ error: cartErr.message });
                                    }
                                    res.status(201).json({ message: "Заказ успешно создан", orderId });
                                });
                            }
                        });
                    });
                }
            );
        });
    });
};

module.exports = { createOrder };