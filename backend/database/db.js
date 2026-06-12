const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'dataBase.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка при открытии базы данных:', err.message);
    } else {
        console.log('Успешно подключено к базе данных SQLite (dataBase.db).');
    }
});

module.exports = db;