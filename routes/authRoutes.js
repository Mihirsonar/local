import { Router } from "express";
import { register, login, logout, googleLogin, getAddresses, saveAddresses } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

router.post("/logout", protect, logout);

// Example protected routes
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// Admin only
router.get("/admin-test", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

// Address routes (protected)
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, saveAddresses);

export default router;

