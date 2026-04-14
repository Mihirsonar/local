import {Router} from 'express';
import { register,login, logout } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../Validators/index.js';
import { validate } from '../middleware/Validator.middleware.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.route("/register").post(registerValidation(), validate, register);
router.route("/login").post(loginValidation(), validate, login);

router.route("/logout").post(verifyJWT,logout);

export default router;