import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../Multer/multer.js";
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct,bulkAddProducts} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);

// ADMIN ONLY
router.post("/", protect, authorize("admin"), addProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.post("/bulk-add", protect, authorize("admin"), upload.single("file"), bulkAddProducts);

export default router;