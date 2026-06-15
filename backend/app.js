const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "API маршрут не найден" });
});

app.listen(3000, () => {
    console.log("Сервер запущен на порту 3000");
});