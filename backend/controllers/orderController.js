// orderController.js
const db = require('../database/db');

// Безопасное добавление новых колонок 
db.run("ALTER TABLE orders ADD COLUMN payment_method TEXT", () => { });
db.run("ALTER TABLE orders ADD COLUMN comment TEXT", () => { });
db.run("ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'new'", () => { });

const createOrder = (req, res) => {
    const { userId, address, items, paymentMethod, comment } = req.body;

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

            db.run(
                'INSERT INTO orders (user_id, address, total_price, payment_method, comment, status) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, address, totalPrice, paymentMethod || 'cash', comment || '', 'new'],
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

const getOrders = async (req, res) => {
    //console.log("Попытка получения заказов...");
    try {
        // Оборачиваем запрос в Promise
        const getRows = (sql, params) => {
            return new Promise((resolve, reject) => {
                db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        };

        // Теперь можно использовать await
        const orders = await getRows(`
            SELECT o.*, u.name as user_name, u.phone as user_phone
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.id DESC
        `, []);

        const items = await getRows(`
            SELECT oi.*, p.name AS title
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id
        `, []);

        orders.forEach(o => {
            o.items = items.filter(i => i.order_id === o.id);
        });

        res.json(orders);
    } catch (err) {
        console.error("КРИТИЧЕСКАЯ ОШИБКА:", err);
        return res.status(500).json({ error: "Ошибка при получении данных: " + err.message });
    }
};

const updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Статус успешно обновлен" });
    });
};

module.exports = { createOrder, getOrders, updateOrderStatus };