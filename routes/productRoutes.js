import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);

// ADMIN ONLY
router.post("/", protect, authorize("admin"), addProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;