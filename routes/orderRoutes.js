import express from 'express';
import { createOrder,getMyOrders,getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import {authorize,protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);

router.get('/my',protect,getMyOrders);

router.get('/admin', protect, authorize("admin"), getAllOrders);

router.put('/:id/status', protect, authorize("admin"),updateOrderStatus);

router.get("/test", (req, res) => {
  res.send("Orders route working");
});

export default router;
