import express from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { requireAdminAuth } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Submit feedback (User authenticated)
router.post('/', authenticateToken, submitFeedback);

// Get all feedback (Admin only)
router.get('/', requireAdminAuth, getAllFeedback);

export default router;
