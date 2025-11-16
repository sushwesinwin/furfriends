import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllProducts = async (req, res, next) => {
    try {
        const { category, isActive } = req.query;
        const where = { isActive: isActive !== undefined ? Boolean(isActive) : true };
        if (category) where.category = category;
        const products = await prisma.product.findMany({ where });
        res.status(200).json(products);
    } catch (error) {
        next(error)
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return next(new Error("Product not found"));
        res.status(200).json(product);
    } catch (error) {
        next(error)
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, images, stock } = req.body;
        const product = await prisma.product.create({ 
            data: { name, description, price, category, images: images || [], stock } });
        res.status(201).json(product);
    } catch (error) {
        next(error)
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const product = await prisma.product.update({ where: { id }, data });
        res.status(200).json(product);
    } catch (error) {
        next(error)
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.delete({ where: { id } });
        res.status(204).json(product);
    } catch (error) {
        next(error)
    }
};