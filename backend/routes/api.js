const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const { getCart, saveCart } = require("../controllers/cartController");

const { register, logIn } = require("../controllers/authController");

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.post("/register", register);
router.post("/logIn", logIn)

router.get("/cart/:userId", getCart);
router.post("/cart/:userId", saveCart);

module.exports = router;