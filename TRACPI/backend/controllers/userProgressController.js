import UserProgress from '../models/UserProgress.js';
import Section from '../models/Section.js';
import Course from '../models/Course.js';
import Question from '../models/Question.js';

// Mark a video as watched and update progress
export const markVideoWatched = async (req, res) => {
  try {
    const { courseId, sectionId, videoId } = req.body;
    const userId = req.user._id;

    // Find or create UserProgress for this user, course, and section
    let progress = await UserProgress.findOne({ user: userId, course: courseId, section: sectionId });
    if (!progress) {
      progress = new UserProgress({ user: userId, course: courseId, section: sectionId, completedVideos: [] });
    }

    // Add videoId to completedVideos if not already present
    if (!progress.completedVideos.includes(videoId)) {
      progress.completedVideos.push(videoId);
    }

    // Get all videos in this section's unit
    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });
    // Each section contains a single unit with multiple videos
    const allVideoIds = section.units.map(u => u.videoID);
    const watchedCount = progress.completedVideos.length;
    const totalVideos = allVideoIds.length;
    // Calculate section progress as a percentage
    progress.sectionProgress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
    // If all videos are watched, mark unit and section as complete
    const allWatched = allVideoIds.every(id => progress.completedVideos.includes(id));
    progress.unitComplete = allWatched;
    progress.sectionComplete = allWatched;

    // Update course progress (count completed sections for this user in this course)
    const totalSections = await Section.countDocuments({ course: courseId });
    const completedSections = await UserProgress.countDocuments({ user: userId, course: courseId, sectionComplete: true });
    progress.courseProgress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

    await progress.save();
    res.json({ message: 'Video marked as watched', progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Start an assessment for a section
export const startAssessment = async (req, res) => {
  try {
    const { courseId, sectionId } = req.body;
    const userId = req.user._id;
    // Check if section is complete
    const progress = await UserProgress.findOne({ user: userId, course: courseId, section: sectionId });
    if (!progress || !progress.sectionComplete) {
      return res.status(400).json({ error: 'Section not complete. Complete all videos before starting assessment.' });
    }
    // Check attempts
    if (progress.sectionAssessment && progress.sectionAssessment.attempts >= 5) {
      return res.status(400).json({ error: 'Maximum assessment attempts reached.' });
    }
    // Get 30 questions for this section
    const questions = await Question.find({ section: sectionId }).limit(30);
    // Start timer (client-side, but record start time for validation)
    progress.sectionAssessment = progress.sectionAssessment || {};
    progress.sectionAssessment.lastAttempt = new Date();
    await progress.save();
    res.json({ questions, timeLimit: 60 }); // 60 minutes
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit assessment answers
export const submitAssessment = async (req, res) => {
  try {
    const { courseId, sectionId, answers } = req.body;
    const userId = req.user._id;
    const progress = await UserProgress.findOne({ user: userId, course: courseId, section: sectionId });
    if (!progress || !progress.sectionComplete) {
      return res.status(400).json({ error: 'Section not complete.' });
    }
    // Check attempts
    if (progress.sectionAssessment && progress.sectionAssessment.attempts >= 5) {
      return res.status(400).json({ error: 'Maximum assessment attempts reached.' });
    }
    // Check time limit
    const now = new Date();
    const start = progress.sectionAssessment?.lastAttempt;
    if (start && (now - start) > 60 * 60 * 1000) { // 60 minutes
      return res.status(400).json({ error: 'Assessment time limit exceeded.' });
    }
    // Get correct answers and calculate score
    const questions = await Question.find({ section: sectionId }).limit(30);
    let score = 0;
    const wrongAnswers = [];
    
    // Create a map of questionId to answer for easier lookup
    const answerMap = {};
    answers.forEach(answer => {
      answerMap[answer.questionId] = answer.answer;
    });
    
    questions.forEach((question, index) => {
      const userAnswer = answerMap[question._id];
      if (userAnswer && userAnswer === question.correctAnswer) {
        score++;
      } else if (userAnswer) {
        // Track wrong answers with question number (1-based index)
        wrongAnswers.push({
          questionNumber: index + 1,
          userAnswer: userAnswer,
          correctAnswer: question.correctAnswer,
          question: question.question
        });
      }
    });
    
    // Update assessment results
    progress.sectionAssessment = progress.sectionAssessment || {};
    progress.sectionAssessment.attempts = (progress.sectionAssessment.attempts || 0) + 1;
    progress.sectionAssessment.score = score;
    progress.sectionAssessment.passed = score >= 25;
    progress.sectionAssessment.timeSpent = Math.round((now - (start || now)) / 60000);
    progress.sectionAssessment.lastAttempt = now;
    await progress.save();
    
    res.json({ 
      score, 
      passed: score >= 25, 
      attempts: progress.sectionAssessment.attempts,
      wrongAnswers,
      totalQuestions: questions.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the current section for the user in a course
export const getCurrentSection = async (req, res) => {
  try {
    const { courseId } = req.query;
    const userId = req.user._id;
    // Find the first section in the course the user has not completed
    const sections = await Section.find({ course: courseId }).sort({ _id: 1 });
    for (const section of sections) {
      const progress = await UserProgress.findOne({ user: userId, course: courseId, section: section._id });
      if (!progress || !progress.sectionComplete || !progress.sectionAssessment?.passed) {
        return res.json({ currentSection: section });
      }
    }
    // If all sections are complete, return null
    res.json({ currentSection: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the next section the user can access in a course
export const getNextSection = async (req, res) => {
  try {
    const { courseId } = req.query;
    const userId = req.user._id;
    const sections = await Section.find({ course: courseId }).sort({ _id: 1 });
    let foundCurrent = false;
    for (const section of sections) {
      const progress = await UserProgress.findOne({ user: userId, course: courseId, section: section._id });
      if (!foundCurrent && (!progress || !progress.sectionComplete || !progress.sectionAssessment?.passed)) {
        foundCurrent = true;
        continue;
      }
      if (foundCurrent) {
        return res.json({ nextSection: section });
      }
    }
    // If no next section, return null
    res.json({ nextSection: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get section progress for a user
export const getSectionProgress = async (req, res) => {
  try {
    const { courseId, sectionId } = req.query;
    const userId = req.user._id;
    const progress = await UserProgress.findOne({ user: userId, course: courseId, section: sectionId });
    res.json({
      sectionProgress: progress ? progress.sectionProgress : 0,
      unitComplete: progress ? progress.unitComplete : false,
      sectionComplete: progress ? progress.sectionComplete : false,
      assessment: progress ? progress.sectionAssessment : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get course progress for a user
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.query;
    const userId = req.user._id;
    // Find all UserProgress for this user and course
    const progresses = await UserProgress.find({ user: userId, course: courseId });
    // Calculate course progress as the average of sectionComplete
    const totalSections = progresses.length;
    const completedSections = progresses.filter(p => p.sectionComplete).length;
    const courseProgress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
    res.json({ courseProgress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

// GET user progress for a specific course section
export const getProgress = async (req, res) => {
  const { courseId, sectionId } = req.params;
  const userId = req.user._id;

  try {
    const progress = await UserProgress.findOne({ user: userId, course: courseId, section: sectionId });
    res.json(progress || { completedVideos: [] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};