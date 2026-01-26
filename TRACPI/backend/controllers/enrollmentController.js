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

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const hasQuestions = course.questions && course.questions.length > 0;

    const progressData = await Promise.all(enrollments.map(async (e) => {
      const userProgressRecords = await UserProgress.find({ user: e.user?._id, course: courseId });

      let totalSectionProgress = 0;
      let passedAsmt = false;

      userProgressRecords.forEach(up => {
        totalSectionProgress += up.sectionProgress || 0;
        if (up.sectionAssessment?.passed) passedAsmt = true;
      });

      const granularProgress = sectionCount > 0 ? Math.round(totalSectionProgress / sectionCount) : 0;

      // If no questions, they pass by finishing the videos
      const assessmentStatus = hasQuestions ? passedAsmt : true;

      // Self-heal: Update the record in the database
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
        passedAssessment: assessmentStatus,
        userId: e.user?._id,
        status: e.user?.status || 'active'
      };
    }));

    res.json(progressData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
