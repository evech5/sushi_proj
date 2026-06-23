const db = require('../database/db');

const createOrder = (req, res) => {
    const { userId, address, items } = req.body;

    if (!userId || !address || !items || items.length === 0) {
        return res.status(400).json({ error: "Не все поля заполнены" });
    }

    db.run('UPDATE users SET address = ? WHERE id = ?', [address, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const productIds = items.map(i => i.id);
        const placeholders = productIds.map(() => '?').join(',');

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
                'INSERT INTO orders (user_id, address, total_price) VALUES (?, ?, ?)',
                [userId, address, totalPrice],
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