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
    updateAdminProfile
} from '../controllers/adminController.js';

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

// Admin login
router.post('/login', loginAdmin);
// Admin logout
router.post('/logout', logoutAdmin);

export default router;