import express from 'express';
import {
  createSection,
  getSectionById,
  updateSectionById,
  deleteSectionById,
  getAllSections,
  getSectionsByCourseId
} from '../controllers/sectionController.js';
import { requireAdminAuth } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public: Get sections by courseId
router.get('/by-course', getSectionsByCourseId);

// Get a section by ID (Protected)
router.get('/:id', authenticateToken, getSectionById);

// Admin Routes
router.post('/', requireAdminAuth, createSection);
router.put('/:id', requireAdminAuth, updateSectionById);
router.delete('/:id', requireAdminAuth, deleteSectionById);
router.get('/', requireAdminAuth, getAllSections);

export default router; 