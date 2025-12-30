import express from 'express';
import { markVideoWatched, startAssessment, submitAssessment, getCurrentSection, getNextSection, getSectionProgress, getCourseProgress, getProgress } from '../controllers/userProgressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mark a video as watched
router.post('/watch-video', authenticateToken, markVideoWatched);
// Start an assessment for a section
router.post('/start-assessment', authenticateToken, startAssessment);
// router.post('/start-assessment', startAssessment); // 🧪 testing only

// Submit assessment answers
router.post('/submit-assessment', authenticateToken, submitAssessment);
// Get the current section for the user in a course
router.get('/current-section', authenticateToken, getCurrentSection);
// Get the next section the user can access in a course
router.get('/next-section', authenticateToken, getNextSection);
// Get section progress for a user
router.get('/section-progress', authenticateToken, getSectionProgress);
// Get course progress for a user
router.get('/course-progress', authenticateToken, getCourseProgress);
// GET progress for a specific course section
router.get('/:courseId/:sectionId', authenticateToken, getProgress);

export default router; 