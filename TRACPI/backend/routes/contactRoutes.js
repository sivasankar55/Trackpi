import express from 'express';
import { submitContactForm, getAllContacts } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact - Submit form
router.post('/', submitContactForm);

// GET /api/contact - Get all submissions (Admin)
router.get('/', getAllContacts);

export default router;
