const db = require('../database/db');

const getProducts = (req, res) => {
    const { category, sort, limit } = req.query;

    let sql = `
        SELECT p.id, p.name AS title, p.compound AS desc, p.price, p.image AS img, c.name AS category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.id
    `;
    let params = [];
    let whereClauses = [];

    if (category && category !== "all") {
        whereClauses.push("c.name = ?");
        params.push(category);
    }

    if (whereClauses.length > 0) {
        sql += " WHERE " + whereClauses.join(" AND ");
    }

    if (sort === "low-to-high") {
        sql += " ORDER BY p.price ASC";
    } else if (sort === "high-to-low") {
        sql += " ORDER BY p.price DESC";
    }

    if (limit) {
        sql += " LIMIT ?";
        params.push(parseInt(limit));
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error("Ошибка БД при получении товаров:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }

        let groupedResult = {};

        rows.forEach(item => {
            const cat = item.category_name;
            if (!groupedResult[cat]) {
                groupedResult[cat] = [];
            }

            const productData = {
                id: String(item.id),
                title: item.title,
                price: `${item.price} ₸`,
                img: item.img
            };

            if (item.desc) {
                productData.desc = item.desc;
            }

            groupedResult[cat].push(productData);
        });

        res.json(groupedResult);
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT p.id, p.name AS title, p.compound AS desc, p.price, p.image AS img 
        FROM products p
        WHERE p.id = ?
    `;

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error("Ошибка БД при получении товара по ID:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }

        if (!row) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        const product = {
            id: String(row.id),
            title: row.title,
            price: `${row.price} ₸`,
            img: row.img
        };

        if (row.desc) {
            product.desc = row.desc;
        }

        res.json(product);
    });
};

const createProduct = (req, res) => {
    const { name, compound, price, image, category_id } = req.body;

    if (!name || !price || !category_id) {
        return res.status(400).json({ error: "Поля Название, Цена и Категория обязательны" });
    }

    const sql = `
        INSERT INTO products (name, compound, price, image, category_id)
        VALUES (?, ?, ?, ?, ?)
    `;
    const params = [name, compound || null, parseFloat(price), image || 'img/default.png', parseInt(category_id)];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Ошибка БД при добавлении товара:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }
        res.status(201).json({ message: "Товар успешно добавлен", productId: this.lastID });
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, compound, price, image, category_id } = req.body;

    if (!name || !price || !category_id) {
        return res.status(400).json({ error: "Поля Название, Цена и Категория обязательны" });
    }

    const sql = `
        UPDATE products 
        SET name = ?, compound = ?, price = ?, image = ?, category_id = ?
        WHERE id = ?
    `;
    const params = [name, compound || null, parseFloat(price), image || 'img/default.png', parseInt(category_id), id];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Ошибка БД при обновлении товара:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Товар не найден" });
        }
        res.json({ message: "Товар успешно обновлен" });
    });
};

const deleteProduct = (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM products WHERE id = ?`;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error("Ошибка БД при удалении товара:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Товар не найден" });
        }
        res.json({ message: "Товар успешно удален" });
    });
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};