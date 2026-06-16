const db = require('../database/db');

// Автоматически создаем таблицу корзины при первом запуске
db.run(`
    CREATE TABLE IF NOT EXISTS cart (
        user_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        PRIMARY KEY (user_id, product_id)
    )
`, (err) => {
    if (err) console.error("Ошибка создания таблицы корзины:", err);
});

// Получить корзину конкретного пользователя
const getCart = (req, res) => {
    const { userId } = req.params;

    // Запрос соединяет таблицу корзины с таблицей товаров, чтобы фронтенд сразу получил картинки, цены и названия
    const sql = `
        SELECT p.id, p.name AS title, p.price, p.image AS img, c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error("Ошибка при получении корзины из БД:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }
        res.json(rows); 
    });
};

// Сохранить (перезаписать) корзину пользователя
const saveCart = (req, res) => {
    const { userId } = req.params;
    const { items } = req.body; // Ожидаем массив [{ id: 1, quantity: 2 }, ...]

    if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Неверный формат данных корзины" });
    }

    db.serialize(() => {
        // 1. Очищаем старую корзину пользователя в БД
        db.run(`DELETE FROM cart WHERE user_id = ?`, [userId], (err) => {
            if (err) {
                console.error("Ошибка очистки старой корзины:", err);
                return res.status(500).json({ error: "Ошибка при обновлении корзины" });
            }
        });

        // Если корзина пустая, просто завершаем запрос
        if (items.length === 0) {
            return res.json({ message: "Корзина синхронизирована (пуста)" });
        }

        // 2. Записываем обновленные элементы
        const stmt = db.prepare(`INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`);
        
        let hasError = false;
        items.forEach(item => {
            stmt.run([userId, item.id, item.quantity], (err) => {
                if (err) {
                    console.error("Ошибка записи товара в корзину:", err);
                    hasError = true;
                }
            });
        });

        stmt.finalize((err) => {
            if (err || hasError) {
                return res.status(500).json({ error: "Некоторые товары не удалось сохранить" });
            }
            res.json({ message: "Корзина успешно сохранена в базе данных" });
        });
    });
};

module.exports = { getCart, saveCart };