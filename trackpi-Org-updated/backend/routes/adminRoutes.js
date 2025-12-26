import express from 'express';
import { addAdmin, editAdmin, deleteAdmin, getAllAdmins, loginAdmin, logoutAdmin, requireAdminAuth } from '../controllers/adminController.js';

const router = express.Router();

// Add admin
router.post('/',requireAdminAuth,addAdmin);

// Edit admin
router.put('/:id', requireAdminAuth, editAdmin);

// Delete admin
router.delete('/:id', requireAdminAuth, deleteAdmin);

// Get all admins
router.get('/', requireAdminAuth, getAllAdmins);

// Admin login
router.post('/login', loginAdmin);
// Admin logout
router.post('/logout', logoutAdmin);

export default router; 