import express from 'express';
import { register,login } from '../controllers/authController.js';

const router = express.Router();

router.post("/register",register);
router.post("/login2",login);

export default router;