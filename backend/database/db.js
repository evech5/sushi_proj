const sqlite3 = require('sqlite3').verbose();
const path = require('path');

<<<<<<< HEAD
=======
// Указываем путь к бинарному файлу базы данных
>>>>>>> 27e19d73a3b4e3a3a1e31eb2dc4516c5cb0ddfcf
const dbPath = path.resolve(__dirname, 'dataBase.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка при открытии базы данных:', err.message);
    } else {
        console.log('Успешно подключено к базе данных SQLite (dataBase.db).');
    }
});

<<<<<<< HEAD
=======
// Экспортируем именно объект подключения к базе
>>>>>>> 27e19d73a3b4e3a3a1e31eb2dc4516c5cb0ddfcf
module.exports = db;