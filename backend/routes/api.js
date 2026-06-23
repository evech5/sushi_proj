const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const { getCart, saveCart } = require("../controllers/cartController");
const { register, logIn } = require("../controllers/authController");
const { createOrder } = require("../controllers/orderController");
const { checkAdmin } = require("../middleware/roleMiddleware");

router.get("/products", getProducts);
router.get("/products/:id", getProductById);

router.get("/categories", getCategories);

router.post("/register", register);
router.post("/logIn", logIn);

router.get("/cart/:userId", getCart);
router.post("/cart/:userId", saveCart);

router.post("/orders", createOrder);

router.use("/products", checkAdmin);

router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.use("/categories", checkAdmin);

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;