import User from '../models/User.js';
import { generateToken } from '../config/googleAuth.js';
import passport from '../config/googleAuth.js';

// Google OAuth login/register
export const googleAuth = async (req, res) => {
  try {
    const { email, name, avatar, googleId, phoneNumber } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ googleId });
    
    if (user) {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      // Generate JWT token
      const token = generateToken(user);
      
      return res.json({ 
        message: 'Login successful', 
        user,
        token 
      });
    }
    
    // Create new user
    user = new User({
      email,
      name,
      avatar,
      googleId,
      phoneNumber
    });
    
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user);
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      user,
      token 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Google OAuth callback (for server-side flow)
export const googleAuthCallback = (req, res) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication failed' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Redirect based on whether the user has a phone number
    const redirectPath = user.phoneNumber ? 'start-course' : 'phone-number';
    res.redirect(`${process.env.FRONTEND_URL}/${redirectPath}?token=${token}`);
  })(req, res);
};

// Get current user profile (authenticated)
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile (authenticated)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Users can only update their own profile unless they're admin
    if (req.user.id !== id && req.user.adminType !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }
    
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user (authenticated)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Users can only delete their own account unless they're admin
    if (req.user.id !== id && req.user.adminType !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this user' });
    }
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 