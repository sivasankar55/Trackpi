import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

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