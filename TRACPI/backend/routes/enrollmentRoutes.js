import express from 'express';
import { getUserCourses, getCourseStats, getCourseUsersProgress } from '../controllers/enrollmentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdminAuth } from '../controllers/adminController.js';

const router = express.Router();

// Get all courses for the logged-in user
router.get('/my-courses', authenticateToken, getUserCourses);
// Get stats for a specific course
router.get('/course/:courseId/stats', requireAdminAuth, getCourseStats);
// Get user-wise progress for a specific course
router.get('/course/:courseId/users-progress', requireAdminAuth, getCourseUsersProgress);

export default router;
