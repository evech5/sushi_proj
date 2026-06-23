const db = require('../database/db');

// Получить список всех категорий
const getCategories = (req, res) => {
    db.all("SELECT id, name FROM categories ORDER BY id ASC", [], (err, rows) => {
        if (err) {
            console.error("Ошибка при получении категорий:", err.message);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }
        res.json(rows);
    });
};

// Добавить новую категорию
const createCategory = (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Название категории обязательно" });
    }

    db.run("INSERT INTO categories (name) VALUES (?)", [name.trim()], function (err) {
        if (err) {
            console.error("Ошибка БД при добавлении категории:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }
        res.status(201).json({ message: "Категория успешно добавлена", id: this.lastID, name: name.trim() });
    });
};

// Изменить существующую категорию
const updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Название категории обязательно" });
    }

    db.run("UPDATE categories SET name = ? WHERE id = ?", [name.trim(), id], function (err) {
        if (err) {
            console.error("Ошибка БД при обновлении категории:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Категория не найдена" });
        }
        res.json({ message: "Категория успешно обновлена" });
    });
};

// Удалить категорию (запрещаем удаление, если в ней остались товары)
const deleteCategory = (req, res) => {
    const { id } = req.params;

    db.get("SELECT COUNT(*) AS count FROM products WHERE category_id = ?", [id], (err, row) => {
        if (err) {
            console.error("Ошибка БД при проверке товаров категории:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }

        if (row.count > 0) {
            return res.status(400).json({
                error: "Нельзя удалить категорию, в которой есть товары. Сначала удалите или перенесите товары из этой категории."
            });
        }

        db.run("DELETE FROM categories WHERE id = ?", [id], function (err) {
            if (err) {
                console.error("Ошибка БД при удалении категории:", err);
                return res.status(500).json({ error: "Ошибка базы данных" });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Категория не найдена" });
            }
            res.json({ message: "Категория успешно удалена" });
        });
    });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };