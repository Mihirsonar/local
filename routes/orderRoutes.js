import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware(['customer']), createOrder);

router.patch('/orders/:id/status', authMiddleware(['vendor']), updateOrderStatus);

router.get('/orders', authMiddleware(['customer']), getOrders);

export default router;
