import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);

// ADMIN ONLY
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;