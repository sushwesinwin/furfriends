import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllPets = async (req, res, next) => {
      try {
        const { type, isAvailable } = req.query;
        const where = { isAvailable: true };
        if (type) {
            where.type = type;
        }
        const pets = await prisma.pet.findMany({
            where
        });
        res.json(pets);
      } catch (error) {
        next(error);
      }  
}   

export const getPetById = async (req, res, next) => {
      try {
        const { id } = req.params;
        const pet = await prisma.pet.findUnique({
            where: { id }
        });
        if (!pet) {
            return res.status(404).json({ error: "Pet not found" });
        }
        res.json(pet);
      } catch (error) {
        next(error);
      }  
}

export const createPet = async (req, res, next) => {
      try {
        const { name, type, breed, age, gender, description, price, images } = req.body;
        const pet = await prisma.pet.create({
            data: {
                name,
                type,
                breed,
                age,
                gender,
                description,
                price,
                images
            }
        });
        res.status(201).json(pet);
      } catch (error) {
        next(error);
      }  
};

export const updatePet = async (req, res, next) => {
      try {
        const { id } = req.params;
        const data = req.body;
        const pet = await prisma.pet.update({
            where: { id },
            data
        });
        res.json(pet);
      } catch (error) {
        next(error);
      }  
}

export const deletePet = async (req, res, next) => {
      try {
        const { id } = req.params;
        const pet = await prisma.pet.delete({ where: { id } });
        res.json(pet);
      } catch (error) {
        next(error);
      }  
}


