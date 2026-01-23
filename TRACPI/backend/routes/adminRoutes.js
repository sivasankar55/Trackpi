import express from 'express';
import {
    addAdmin,
    editAdmin,
    deleteAdmin,
    getAllAdmins,
    loginAdmin,
    logoutAdmin,
    requireAdminAuth,
    suspendAdmin,
    getAdminProfile,
    updateAdminProfile,
    updateAdminProfilePicture,
    upload
} from '../controllers/adminController.js';
import { resetAttempts as resetAssessmentAttempts } from '../controllers/userProgressController.js';

const router = express.Router();

// Add admin
router.post('/', requireAdminAuth, addAdmin);

// Edit admin
router.put('/:id', requireAdminAuth, editAdmin);

// Suspend admin
router.post('/:id/suspend', requireAdminAuth, suspendAdmin);

// Delete admin
router.delete('/:id', requireAdminAuth, deleteAdmin);

// Get all admins
router.get('/', requireAdminAuth, getAllAdmins);

// Profile routes
router.get('/profile', requireAdminAuth, getAdminProfile);
router.put('/profile', requireAdminAuth, updateAdminProfile);
router.put('/profile/picture', requireAdminAuth, upload.single('profilePicture'), updateAdminProfilePicture);

// Admin login
router.post('/login', loginAdmin);
// Admin logout
router.post('/logout', logoutAdmin);

// Reset user assessment attempts
router.post('/reset-user-attempts', requireAdminAuth, resetAssessmentAttempts);

export default router;