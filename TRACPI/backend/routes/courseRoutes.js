import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById
} from '../controllers/courseController.js';

const router = express.Router();

// Create a new course
router.post('/', createCourse);
// Get all courses
router.get('/', getAllCourses);
// Get a course by ID
router.get('/:id', getCourseById);
// Update a course by ID
router.put('/:id', updateCourseById);
// Delete a course by ID
router.delete('/:id', deleteCourseById);

export default router; 