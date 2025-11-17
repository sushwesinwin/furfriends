import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllBlogPosts = async (req, res, next) => {
  try {
    const { isPublished, authorId } = req.query;
    const where = { isPublished: isPublished !== undefined ? isPublished === 'true' : true };
    if (authorId) where.authorId = authorId;
    const posts = await prisma.blogPost.findMany({
      where,
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getBlogPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    });
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const createBlogPost = async (req, res, next) => {
  try {
    const authorId = req.user.id;
    const { title, content, excerpt, image } = req.body;
    const post = await prisma.blogPost.create({
      data: { title, content, excerpt, image, authorId },
      include: { author: true },
    });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, image, isPublished } = req.body;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const updated = await prisma.blogPost.update({
      where: { id },
      data: { title, content, excerpt, image, isPublished },
      include: { author: true },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    await prisma.blogPost.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

