import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUserCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: { id: true, name: true, price: true, images: true, stock: true },
        },
      },
    });
    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    res.json({ items: cartItems, total });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.stock < quantity) {
      return res.status(400).json({ error: 'Product not available or insufficient stock' });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, quantity },
        include: { product: true },
      });
    }
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be positive' });
    }
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    const cartItem = await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity },
      create: { userId, productId, quantity },
      include: { product: true },
    });
    res.json(cartItem);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await prisma.cartItem.deleteMany({ where: { userId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

