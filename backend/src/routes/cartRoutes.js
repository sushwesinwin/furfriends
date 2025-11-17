import express from 'express';
import { getUserCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected
router.get('/', auth, getUserCart);
router.post('/', auth, addToCart);
router.put('/:productId', auth, updateCartItem);
router.delete('/:productId', auth, removeFromCart);
router.delete('/', auth, clearCart); // Clear all

export default router;