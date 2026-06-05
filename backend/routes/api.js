const express = require("express");
const router = express.Router();

const { getProducts, getProductById } = require("../controllers/productController");

// Маршрут для списка объектов (обрабатывает query: ?category=...&sort=...&limit=...)
router.get("/products", getProducts);

// Маршрут для получения одного объекта по параметру (req.params)
router.get("/products/:id", getProductById);

module.exports = router;