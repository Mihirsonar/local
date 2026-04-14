import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/logout", protect, logout);

// Example protected routes
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// Admin only
router.get("/admin-test", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

export default router;