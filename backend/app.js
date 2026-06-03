const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "../frontend")));

const apiRoutes = require("./routes/api");

app.use("/api", apiRoutes);

app.listen(3000, () => {
    console.log("Сервер запущен на порту 3000");
});