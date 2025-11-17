import express from 'express';
import { getUserAppointments, getAllAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected
router.get('/my', auth, getUserAppointments);
router.get('/', auth, getAllAppointments); // Admin-only
router.post('/', auth, createAppointment);
router.put('/:id', auth, updateAppointment);
router.delete('/:id', auth, deleteAppointment);

export default router;