const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'dataBase.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS order_items");
    db.run("DROP TABLE IF EXISTS orders");

    db.run(`
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            address TEXT NOT NULL DEFAULT '',
            total_price INTEGER NOT NULL,
            status TEXT DEFAULT 'new',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `);

    db.all("PRAGMA table_info(users)", (err, rows) => {
        if (err) return;
        const hasAddress = rows.some(row => row.name === 'address');
        if (!hasAddress) {
            db.run("ALTER TABLE users ADD COLUMN address TEXT DEFAULT ''");
        }
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Миграция успешно завершена. Таблицы orders и order_items пересозданы.');
    }
});