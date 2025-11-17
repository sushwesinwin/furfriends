import express from 'express';
import { getUserOrders, createOrder, updateOrderStatus } from '../controllers/orderController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected
router.get('/my', auth, getUserOrders);
router.post('/', auth, createOrder);
router.put('/:id', auth, updateOrderStatus); // User or admin

export default router;