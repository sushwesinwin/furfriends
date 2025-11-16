import express from "express";
import { getAllPets, getPetById, createPet, updatePet, deletePet } from "../controllers/petController.js";
import auth from "../middleware/authMiddleware.js"; // protect create, update, delete

const router = express.Router();

router.get('/', getAllPets);
router.get('/:id', getPetById);

router.post('/', auth, createPet);
router.put('/:id', auth, updatePet);
router.delete('/:id', auth, deletePet);

export default router;
