import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserAppointments = async (req, res, next) => {
    try {
        const userId = req.user.id; // From auth Middleware
        const { status, service } = req.query;
        const where = { userId };
        if (status) where.status = status;
        if (service) where.service = service;
        const appointments = await prisma.appointment.findMany({ 
            where,
            include: { user: { select: { name: true, email: true } } },
            orderBy: { date: 'asc' },  
        });
        res.json(appointments);
    } catch (error) {
        next(error);
    }
};

export const getAllAppointments = async (req, res, next) => {
    try {
        // Admin only
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { status, service } = req.query;
        const where = {};
        if (status) where.status = status;
        if (service) where.service = service;
        const appointments = await prisma.appointment.findMany({ 
            where,
            include: { user: { select: { name: true, email: true } } },
            orderBy: { date: 'asc' },  
        });
        res.json(appointments);
    } catch (error) {
        next(error);
    }
}

export const createAppointment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { service, date, time, notes } = req.body;
        const appointment = await prisma.appointment.create({
            data: { userId, service, date, time, notes },
            include: { user: true },
        })
        res.json(appointment);
    } catch (error) {
        next(error);
    }
}

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status, notes },
      include: { user: true },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    await prisma.appointment.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};