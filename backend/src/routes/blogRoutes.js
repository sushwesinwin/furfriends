import express from 'express';
import { getAllBlogPosts, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost } from '../controllers/blogController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllBlogPosts);
router.get('/:id', getBlogPostById);

// Protected
router.post('/', auth, createBlogPost);
router.put('/:id', auth, updateBlogPost);
router.delete('/:id', auth, deleteBlogPost);

export default router;