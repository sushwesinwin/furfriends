import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    const where = { userId };
    if (status) where.status = status;
    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: { product: true },
        },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderItems } = req.body; // Array of { productId, quantity }
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: 'Order items required' });
    }

    // Calculate total and create order items
    let total = 0;
    const orderItemData = orderItems.map(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
      total += product.price * item.quantity;
      // Update stock
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
      return { productId: item.productId, quantity: item.quantity, price: product.price };
    });

    const resolvedItems = await Promise.all(orderItemData);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        orderItems: { create: resolvedItems },
      },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    // Clear cart (optional)
    await prisma.cartItem.deleteMany({ where: { userId } });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { orderItems: { include: { product: true } } },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

