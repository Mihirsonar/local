import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import {authorize} from '../middleware/authMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authorize('customer'), createOrder);

router.patch('/orders/:id/status', authorize('vendor'), updateOrderStatus);

router.get('/orders', protect, getOrders);
// router.get('/orders', authorize('customer'), getOrders);

export default router;
