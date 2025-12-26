import express from 'express';
import { 
  googleAuth, 
  googleAuthCallback,
  getCurrentUser,
  getUserProfile, 
  updateUser, 
  deleteUser, 
  getAllUsers 
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdminAuth } from '../controllers/adminController.js';

const router = express.Router();

// Google OAuth routes
router.post('/google', googleAuth);
router.get('/google', (req, res) => {
  // Initiate Google OAuth flow
  res.redirect('/google/callback');
});
router.get('/google/callback', googleAuthCallback);

// Public routes
router.get('/profile/:id', getUserProfile);

// Protected routes (require authentication)
router.get('/me',authenticateToken, getCurrentUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', requireAdminAuth, deleteUser);

// Admin routes (require authentication)
router.get('/', requireAdminAuth, getAllUsers);

export default router; 