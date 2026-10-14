import express from "express";
import {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
  testNotification
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/vapid-public-key", getVapidPublicKey);
router.post("/subscribe", protect, subscribe);
router.post("/unsubscribe", protect, unsubscribe);
router.post("/test", protect, testNotification);

export default router;
