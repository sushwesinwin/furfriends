import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me (protected)
router.get('/me', authMiddleware, getCurrentUser);

// POST /api/auth/logout (protected)
router.post('/logout', authMiddleware, logout);

export default router;