import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
<<<<<<< HEAD
import {authMiddleware} from '../middleware/authMiddleware.js';
import { protectRoute } from '../middleware/authMiddleware.js';
=======
import authMiddleware from '../middleware/authMiddleware.js';
>>>>>>> ac842cea2b00137a3a323ba9dac3f331dbc3a8fd

const router = express.Router();

router.post('/', authMiddleware(['customer']), createOrder);

router.patch('/orders/:id/status', authMiddleware(['vendor']), updateOrderStatus);

<<<<<<< HEAD
router.get('/orders', protectRoute, getOrders);
=======
router.get('/orders', authMiddleware(['customer']), getOrders);
>>>>>>> ac842cea2b00137a3a323ba9dac3f331dbc3a8fd

export default router;
