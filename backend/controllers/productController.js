<<<<<<< HEAD

const db = require('../database/db'); 

const getProducts = (req, res) => {
    const { category, sort, limit } = req.query;
    
    // базовый SQL-запрос с объединением таблиц
=======
// Импортируем подключение к базе данных из нашего нового файла db.js
const db = require('../database/db'); 

// Получение списка товаров с обработкой req.query (фильтрация, сортировка, лимит)
const getProducts = (req, res) => {
    const { category, sort, limit } = req.query;
    
    // Пишем базовый SQL-запрос с объединением таблиц
>>>>>>> 27e19d73a3b4e3a3a1e31eb2dc4516c5cb0ddfcf
    let sql = `
        SELECT p.id, p.name AS title, p.compound AS desc, p.price, p.image AS img, c.name AS category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.id
    `;
    let params = [];
    let whereClauses = [];

<<<<<<< HEAD
    // Фильтрация по категории на уровне базы данных
=======
    // 1. Фильтрация по категории на уровне базы данных
>>>>>>> 27e19d73a3b4e3a3a1e31eb2dc4516c5cb0ddfcf
    if (category && category !== "all") {
        whereClauses.push("c.name = ?");
        params.push(category);
    }

    if (whereClauses.length > 0) {
        sql += " WHERE " + whereClauses.join(" AND ");
    }

<<<<<<< HEAD
    // Сортировка на уровне базы данных
=======
    // 2. Сортировка на уровне базы данных
>>>>>>> 27e19d73a3b4e3a3a1e31eb2dc4516c5cb0ddfcf
    if (sort === "low-to-high") {
        sql += " ORDER BY p.price ASC";
    } else if (sort === "high-to-low") {
        sql += " ORDER BY p.price DESC";
    }

<<<<<<< HEAD
    //  Лимит на уровне базы данных
=======
    // 3. Лимит на уровне базы данных
>>>>>>> 27e19d73a3b4e3a3a1e31eb2dc4516c5cb0ddfcf
    if (limit) {
        sql += " LIMIT ?";
        params.push(parseInt(limit));
    }

    // Выполняем собранный запрос к SQLite
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error("Ошибка БД при получении товаров:", err);
            return res.status(500).json({ error: "Ошибка базы данных" });
        }

<<<<<<< HEAD
=======
        // Группируем результат по категориям, чтобы вернуть точно такую же структуру, как раньше
>>>>>>> 27e19d73a3b4e3a3a1e31eb2dc4516c5cb0ddfcf
        let groupedResult = {};
        
        rows.forEach(item => {
            const cat = item.category_name;
            if (!groupedResult[cat]) {
                groupedResult[cat] = [];
            }
            
            const productData = {
<<<<<<< HEAD
                id: String(item.id),      
                title: item.title,
                price: `${item.price} ₸`,  
                img: item.img
            };

=======
                id: String(item.id),       // Приводим к строке, чтобы фронтенд не заметил разницы со старыми ID (r1, f2)
                title: item.title,
                price: `${item.price} ₸`,  // Возвращаем знак тенге для фронтенда
                img: item.img
            };

            // Добавляем описание только если оно заполнено (например, у напитков его может не быть)
>>>>>>> 27e19d73a3b4e3a3a1e31eb2dc4516c5cb0ddfcf
            if (item.desc) {
                productData.desc = item.desc;
            }

            groupedResult[cat].push(productData);
        });

        res.json(groupedResult);
    });
};

// Получение одного конкретного товара по ID с использованием req.params
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

module.exports = {
    getProducts,
    getProductById
};