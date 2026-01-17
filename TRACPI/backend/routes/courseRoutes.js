import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  getCourseStats,
  getAllCoursesWithGlobalStats
} from '../controllers/courseController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Get stats
router.get('/stats', getCourseStats);
// Get specific admin stats view
router.get('/stats-with-courses', getAllCoursesWithGlobalStats);
// Create a new course
router.post('/', upload.single('courseImage'), createCourse);
// Get all courses
router.get('/', getAllCourses);
// Get a course by ID
router.get('/:id', getCourseById);
// Update a course by ID
router.put('/:id', upload.single('courseImage'), updateCourseById);
// Delete a course by ID
router.delete('/:id', deleteCourseById);

export default router; 