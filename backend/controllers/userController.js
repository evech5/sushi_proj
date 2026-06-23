const db = require('../database/db');

const getUsers = (req, res) => {
    const { phone } = req.query; // Получаем параметр из запроса: /api/users?phone=123

    let sql = "SELECT id, name, phone, status FROM users";
    let params = [];

    if (phone) {
        sql += " WHERE phone LIKE ?";
        params = [`%${phone}%`]; // Ищем частичное совпадение
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Ошибка базы данных" });
        }
        res.json(rows);
    });
};

const updateUserStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['user', 'admin', 'kitchen'].includes(status)) {
        return res.status(400).json({ error: "Недопустимый статус пользователя" });
    }

    db.run("UPDATE users SET status = ? WHERE id = ?", [status, id], function(err) {
        if (err) {
            return res.status(500).json({ error: "Ошибка при обновлении статуса" });
        }
        res.json({ message: "Статус пользователя обновлен" });
    });
};

module.exports = { getUsers, updateUserStatus };