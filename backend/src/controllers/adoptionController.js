import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUserAdoptions = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const adoption = await prisma.adoption.findMany({
            where: { userId },
            include: { pet: true, user: { select: { name: true } } }
        })
        return res.status(200).json(adoption);
    } catch (error) {
        next(error);
    }
}

export const createAdoption = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { petId } = req.body;
        const adoption = await prisma.adoption.create({
            data: { userId, petId },
            include: { pet: true },
        });
        await prisma.pet.update({ where: { id: petId }, data: { isAvailable: false } });
        return res.status(201).json(adoption);
    } catch (error) {
        next(error);
    }
}

export const updateAdoption = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { petId } = req.body;
        const adoption = await prisma.adoption.update({
            where: { id },
            data: { petId },
            include: { pet: true },
        });
        return res.status(200).json(adoption);
    } catch (error) {
        next(error);
    }
}