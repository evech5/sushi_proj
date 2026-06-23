const db = require('../database/db'); 

const register = (req, res) => {
    const { name, phone } = req.body;

    // Валидация на стороне сервера
    if (!name || !phone) {
        return res.status(400).json({ error: "Имя и номер телефона обязательны для заполнения" });
    }

    const checkSql = `SELECT * FROM users WHERE phone = ?`;
    db.get(checkSql, [phone], (err, row) => {
        if (err) {
            console.error("Ошибка БД при проверке телефона:", err);
            return res.status(500).json({ error: "Ошибка базы данных при проверке" });
        }

        if (row) {
            return res.status(409).json({ error: "Пользователь с таким номером телефона уже зарегистрирован" });
        }

        const insertSql = `INSERT INTO users (name, phone, status) VALUES (?, ?, ?)`;
        const defaultStatus = 'user';

        db.run(insertSql, [name, phone, defaultStatus], function (err) {
            if (err) {
                console.error("Ошибка БД при регистрации:", err);
                return res.status(500).json({ error: "Ошибка базы данных при записи пользователя" });
            }

            res.status(201).json({ 
                message: "Регистрация прошла успешно", 
                userId: this.lastID 
            });
        });
    });
};
const logIn = (req, res) => {
    const { phone } = req.body;

    // Валидация на стороне сервера
    if (!phone) {
        return res.status(400).json({ error: "Номер телефона обязателен для заполнения" });
    }

    const checkSql = `SELECT * FROM users WHERE phone = ?`;
    db.get(checkSql, [phone], (err, row) => {
        if (err) {
            console.error("Ошибка БД при входе:", err);
            return res.status(500).json({ error: "Ошибка базы данных при проверке пользователя" });
        }

        if (!row) {
            return res.status(404).json({ error: "Пользователь с таким номером телефона не найден. Пройдите регистрацию." });
        }

        res.status(200).json({ 
            message: "Вход прошел успешно", 
            user: {
                id: row.id,
                name: row.name,
                phone: row.phone,
                status: row.status 
            }
        });
    });
};
module.exports = { register, logIn };