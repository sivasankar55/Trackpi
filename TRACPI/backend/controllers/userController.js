import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import UserProgress from '../models/UserProgress.js';
import { generateToken } from '../config/googleAuth.js';
import passport from '../config/googleAuth.js';
import dayjs from 'dayjs';

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

    // Allow if it's an admin session OR if user is deleting their own account
    const isAdmin = req.session && req.session.adminId;
    const isUserSelf = req.user && req.user._id.toString() === id;

    if (!isAdmin && !isUserSelf) {
      return res.status(403).json({ error: 'Not authorized to delete this user' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Also delete user's enrollments
    await Enrollment.deleteMany({ user: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    // Get enrollment details for each user
    const usersWithEnrollments = await Promise.all(users.map(async (user) => {
      const enrollments = await Enrollment.find({ user: user._id });
      const enrollmentCount = enrollments.length;
      const maxProgress = enrollmentCount > 0
        ? Math.max(...enrollments.map(e => e.progress || 0))
        : 0;

      return {
        ...user.toObject(),
        enrollmentCount,
        maxProgress
      };
    }));

    res.json(usersWithEnrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Suspend user
export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body; // duration in days, 0 for permanent

    const suspendedUntil = duration > 0 ? dayjs().add(duration, 'day').toDate() : null;

    const user = await User.findByIdAndUpdate(id, {
      status: 'suspended',
      suspendedUntil
    }, { new: true });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User suspended successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Manually add user (admin only)
export const addUser = async (req, res) => {
  try {
    const { email, name, phoneNumber } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user (manually added users might not have a googleId initially)
    user = new User({
      email,
      name,
      phoneNumber,
      status: 'active'
    });

    await user.save();

    res.status(201).json({
      message: 'User added successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get full details of a user for the User Info page
export const getUserFullDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get enrollments with course details
    const enrollments = await Enrollment.find({ user: id }).populate('course');

    // Get all progress documents for this user
    const progressDocs = await UserProgress.find({ user: id })
      .populate('course')
      .populate('section')
      .sort({ updatedAt: -1 });

    // Format course data for the table
    const coursesData = enrollments.map(enrollment => {
      const courseProgress = progressDocs.filter(p => p.course?._id.toString() === enrollment.course?._id.toString());

      // Calculate average score from sections that have assessments
      const assessedSections = courseProgress.filter(p => p.sectionAssessment && p.sectionAssessment.attempts > 0);
      const avgScore = assessedSections.length > 0
        ? Math.round(assessedSections.reduce((acc, curr) => acc + (curr.sectionAssessment.score || 0), 0) / assessedSections.length)
        : null;

      // Calculate total duration (sum of timeSpent in minutes)
      const totalDurationMinutes = courseProgress.reduce((acc, curr) => acc + (curr.sectionAssessment?.timeSpent || 0), 0);
      const durationHours = Math.floor(totalDurationMinutes / 60);
      const durationMinutes = totalDurationMinutes % 60;

      // Completion date (latest updatedAt if progress is 100)
      const completionDate = enrollment.progress === 100
        ? enrollment.updatedAt
        : null;

      return {
        _id: enrollment.course?._id,
        name: enrollment.course?.title || 'Unknown Course',
        completionDate,
        score: avgScore,
        duration: `${durationHours}hrs ${durationMinutes}m`,
        progress: enrollment.progress,
        sections: courseProgress.map(p => ({
          name: p.section?.title || 'Unknown Section',
          startTime: p.createdAt,
          endTime: p.updatedAt,
          score: p.sectionAssessment?.score,
          passed: p.sectionAssessment?.passed
        }))
      };
    });

    // Summary stats
    const stats = {
      joined: user.createdAt,
      coursesCompleted: enrollments.filter(e => e.progress === 100).length,
      upcomingCourses: coursesData.filter(c => c.progress < 100).length,
      overallProgress: enrollments.length > 0
        ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length)
        : 0
    };

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || 'N/A',
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      stats,
      courses: coursesData
    });
  } catch (error) {
    console.error('Error fetching user full details:', error);
    res.status(500).json({ error: error.message });
  }
}; 