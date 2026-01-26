import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import UserProgress from '../models/UserProgress.js';
import Section from '../models/Section.js';

// Get all courses for the logged-in user
export const getUserCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const enrollments = await Enrollment.find({ user: userId }).populate('course');
    const courses = enrollments.map(enrollment => ({
      ...enrollment.course.toObject(),
      progress: enrollment.progress,
      enrollmentDate: enrollment.enrollmentDate
    }));
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get course statistics
export const getCourseStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ course: courseId });
    const totalEnrolled = enrollments.length;
    const notStarted = enrollments.filter(e => e.progress === 0).length;
    const completed = enrollments.filter(e => e.progress === 100).length;
    const inProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
    res.json({
      totalEnrolled,
      notStarted,
      completed,
      inProgress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user-wise progress for a specific course
export const getCourseUsersProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ course: courseId }).populate('user').populate('course');
    const allSections = await Section.find({ course: courseId });
    const sectionCount = allSections.length;

    const progressData = await Promise.all(enrollments.map(async (e) => {
      // Recalculate granular progress on-the-fly for real-time accuracy
      const userProgressRecords = await UserProgress.find({ user: e.user?._id, course: courseId });
      let totalSectionProgress = 0;
      userProgressRecords.forEach(up => {
        totalSectionProgress += up.sectionProgress || 0;
      });
      const granularProgress = sectionCount > 0 ? Math.round(totalSectionProgress / sectionCount) : 0;

      // Self-heal: Update the record in the database if it was stuck at 0 or a jumpy value
      if (e.progress !== granularProgress) {
        e.progress = granularProgress;
        await e.save();
      }

      return {
        name: e.user?.name || 'Unknown',
        username: e.user?.email || 'N/A',
        courseName: e.course?.courseName || 'Deleted Course',
        startDate: e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : 'N/A',
        rawDate: e.enrollmentDate,
        progress: granularProgress,
        userId: e.user?._id,
        status: e.user?.status || 'active'
      };
    }));

    res.json(progressData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
