import express from "express";
import {
  getDashboardStats,
  getAdminCustomers,
  updateStockAndPrice,
  getAdminCategories,
  getStoreSettings,
  updateStoreSettings,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", protect, authorize("admin"), getDashboardStats);
router.get("/customers", protect, authorize("admin"), getAdminCustomers);
router.put("/products/:id/stock", protect, authorize("admin"), updateStockAndPrice);
router.get("/categories", protect, authorize("admin"), getAdminCategories);
router.get("/store-settings", protect, authorize("admin"), getStoreSettings);
router.put("/store-settings", protect, authorize("admin"), updateStoreSettings);

export default router;
