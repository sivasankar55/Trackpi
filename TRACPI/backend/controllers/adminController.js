import Admin from '../models/Admin.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import bcrypt from 'bcrypt';
dayjs.extend(relativeTime);

// Add new admin
export const addAdmin = async (req, res) => {
  try {
    const { confirmPassword, ...adminData } = req.body;
    const admin = new Admin(adminData);
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit admin
export const editAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Get the current admin's session
    const currentAdmin = await Admin.findById(req.session.adminId);
    if (!currentAdmin) {
      return res.status(401).json({ error: 'Unauthorized: Admin login required' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, currentAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Prevent self-deletion
    if (id === req.session.adminId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Suspend admin
export const suspendAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, duration } = req.body; // duration in days, 0 for permanent

    // Get the current admin's session
    const currentAdmin = await Admin.findById(req.session.adminId);
    if (!currentAdmin) {
      return res.status(401).json({ error: 'Unauthorized: Admin login required' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, currentAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Prevent self-suspension
    if (id === req.session.adminId) {
      return res.status(400).json({ error: 'Cannot suspend your own account' });
    }

    const suspendedUntil = duration > 0 ? dayjs().add(duration, 'day').toDate() : null;

    const admin = await Admin.findByIdAndUpdate(id, {
      status: 'suspended',
      suspendedUntil
    }, { new: true });

    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ message: 'Admin suspended successfully', admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    const adminsWithRelativeLogin = admins.map(admin => ({
      ...admin.toObject(),
      lastLogin: admin.lastLogin ? dayjs(admin.lastLogin).fromNow() : null,
      suspendedUntilText: admin.suspendedUntil ? dayjs(admin.suspendedUntil).fromNow() : null
    }));
    res.json(adminsWithRelativeLogin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check if suspended
    if (admin.status === 'suspended') {
      if (admin.suspendedUntil && dayjs().isAfter(admin.suspendedUntil)) {
        // Automatically reactivate if suspension time is over
        admin.status = 'active';
        admin.suspendedUntil = null;
        await admin.save();
      } else {
        const message = admin.suspendedUntil
          ? `Account suspended until ${dayjs(admin.suspendedUntil).format('LL')}`
          : 'Account suspended indefinitely';
        return res.status(403).json({ error: message });
      }
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    req.session.adminId = admin._id;
    admin.lastLogin = new Date();
    await admin.save();
    res.json({ message: 'Login successful', admin: { id: admin._id, username: admin.username, email: admin.email, adminType: admin.adminType } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin logout
export const logoutAdmin = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};

// Get current admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.session.adminId).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update current admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    // If password is being updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const admin = await Admin.findByIdAndUpdate(
      req.session.adminId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Middleware to check if admin is authenticated
export const requireAdminAuth = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Admin login required' });
};