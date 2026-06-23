// roleMiddleware.js
const db = require('../database/db');

const checkAdmin = (req, res, next) => {
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({ error: "Доступ запрещен. Необходима авторизация." });
    }

    const sql = `SELECT status FROM users WHERE id = ?`;
    
    db.get(sql, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Ошибка базы данных" });
        }

        if (!row || row.status !== 'admin') {
            return res.status(403).json({ error: "Доступ запрещен. Необходимы права администратора." });
        }

        next();
    });
};

const checkKitchen = (req, res, next) => {
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({ error: "Доступ запрещен. Необходима авторизация." });
    }

    const sql = `SELECT status FROM users WHERE id = ?`;
    
    db.get(sql, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Ошибка базы данных" });
        }

        if (!row || (row.status !== 'kitchen' && row.status !== 'admin')) {
            return res.status(403).json({ error: "Доступ запрещен. Необходимы права персонала кухни." });
        }

        next();
    });
};

module.exports = { checkAdmin, checkKitchen };