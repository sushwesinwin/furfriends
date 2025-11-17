import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getUserAdoptions, createAdoption, updateAdoption } from "../controllers/adoptionController.js";

const router = express.Router();

router.post("/", auth, createAdoption);
router.get("/", auth, getUserAdoptions);
router.put("/:id", auth, updateAdoption); // Admin-only for status update

export default router;
