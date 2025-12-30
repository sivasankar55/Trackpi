import express from 'express';
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById
} from '../controllers/questionController.js';
import { requireAdminAuth } from '../controllers/adminController.js';

const router = express.Router();

// Create a new question
router.post('/', requireAdminAuth, createQuestion);
// Get all questions
router.get('/', requireAdminAuth, getAllQuestions);
// Get a question by ID
router.get('/:id', requireAdminAuth, getQuestionById);
// Update a question by ID
router.put('/:id', requireAdminAuth, updateQuestionById);
// Delete a question by ID
router.delete('/:id', requireAdminAuth, deleteQuestionById);

export default router; 