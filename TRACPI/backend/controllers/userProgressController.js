import UserProgress from '../models/UserProgress.js';
import Section from '../models/Section.js';
import Course from '../models/Course.js';
import Question from '../models/Question.js';

const normalizeVideoId = (id) => {
  if (!id) return '';
  let str = String(id).trim();
  // Handle YouTube
  const ytMatch = str.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|v\/|embed\/|user\/(?:\w+\/)+))([^?&"'>]+)/);
  if (ytMatch) return ytMatch[1];
  // Handle Vimeo
  const vimeoMatch = str.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) return vimeoMatch[1];

  return str;
};

// Mark a video as watched and update progress
export const markVideoWatched = async (req, res) => {
  try {
    console.log('USER:', req.user);
    console.log('BODY:', req.body);

    const { courseId, sectionId, videoId } = req.body;
    const userId = req.user._id;

    // Find or create UserProgress for this user, course, and section
    let progress = await UserProgress.findOne({ user: userId, course: courseId, section: sectionId });
    if (!progress) {
      progress = new UserProgress({ user: userId, course: courseId, section: sectionId, completedVideos: [] });
    }

    // Get section details
    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    // Use unique video IDs to handle potential duplicates in admin entry
    const allVideoIds = [...new Set(
      section.units
        .map(u => normalizeVideoId(u.videoID))
        .filter(id => id !== '')
    )];
    const totalVideos = allVideoIds.length;

    // Add videoId to completedVideos if not already present
    const videoIdStr = normalizeVideoId(videoId);
    if (videoIdStr && !progress.completedVideos.some(v => normalizeVideoId(v) === videoIdStr)) {
      progress.completedVideos.push(videoIdStr);
    }

    // Calculate section progress correctly
    const watchedCount = allVideoIds.filter(id =>
      progress.completedVideos.some(v => normalizeVideoId(v) === id)
    ).length;
    progress.sectionProgress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 100;

    const allWatched = totalVideos === 0 || allVideoIds.every(id =>
      progress.completedVideos.some(v => String(v).trim().toLowerCase() === String(id).trim().toLowerCase())
    );
    progress.unitComplete = allWatched;
    progress.sectionComplete = allWatched;

    // Update course progress by checking ALL sections in the course
    const allSectionsInCourse = await Section.find({ course: courseId });
    let completedSectionsCount = 0;

    for (const s of allSectionsInCourse) {
      if (s.units.length === 0) {
        completedSectionsCount++;
        continue;
      }
      // Check if user has a completion record for this specific section
      const sProgress = await UserProgress.findOne({
        user: userId,
        course: courseId,
        section: s._id
      });
      if (sProgress && sProgress.sectionComplete) {
        completedSectionsCount++;
      }
    }

    progress.courseProgress = allSectionsInCourse.length > 0
      ? Math.round((completedSectionsCount / allSectionsInCourse.length) * 100)
      : 0;

    await progress.save();
    res.json({ message: 'Video marked as watched', progress });
  } catch (error) {
    console.error("Mark watched error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Start an assessment for a section
export const startAssessment = async (req, res) => {
  try {
    const { courseId, sectionId } = req.body;
    const userId = req.user._id;

    // Find or create UserProgress for this user, course, and section
    let progress = await UserProgress.findOne({ user: userId, course: courseId, section: sectionId });

    // Get section details for on-the-fly completion check
    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    // Use unique video IDs to handle potential duplicates in admin entry
    const allVideoIds = [...new Set(
      section.units
        .map(u => normalizeVideoId(u.videoID))
        .filter(id => id !== '')
    )];
    const totalVideos = allVideoIds.length;

    // Calculate if complete on the fly to be safe
    const watchedVideos = progress ? progress.completedVideos : [];
    console.log(`[startAssessment] User: ${userId}, Section: ${sectionId}`);
    console.log(`[startAssessment] allVideoIds:`, allVideoIds);
    console.log(`[startAssessment] watchedVideos:`, watchedVideos);
    const watchedCount = allVideoIds.filter(id =>
      watchedVideos.some(v => normalizeVideoId(v) === id)
    ).length;
    const isActuallyComplete = totalVideos === 0 || watchedCount >= totalVideos;

    if (!isActuallyComplete) {
      return res.status(400).json({
        error: `Section not complete. You have watched ${watchedCount} out of ${totalVideos} unique videos. Please finish all videos in this section first.`
      });
    }

    // Refresh progress status if it was stale
    if (progress && !progress.sectionComplete) {
      progress.sectionComplete = true;
      progress.unitComplete = true;
      progress.sectionProgress = 100;
      await progress.save();
    } else if (!progress) {
      progress = new UserProgress({
        user: userId,
        course: courseId,
        section: sectionId,
        completedVideos: [],
        sectionProgress: 100,
        unitComplete: true,
        sectionComplete: true
      });
      await progress.save();
    }

    // Check attempts
    if (progress.sectionAssessment && progress.sectionAssessment.attempts >= 5) {
      return res.status(400).json({ error: 'Maximum assessment attempts reached.' });
    }

    // Fetch questions and timeLimit from Course model
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const questions = course.questions || [];
    if (questions.length === 0) {
      return res.status(400).json({ error: 'No assessment questions found for this course.' });
    }

    // Update last attempt
    progress.sectionAssessment = progress.sectionAssessment || { attempts: 0 };
    progress.sectionAssessment.lastAttempt = new Date();
    await progress.save();

    res.json({ questions, timeLimit: course.quizTime || 60 });
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

    // Fetch correct answers and timeLimit from Course model
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const maxTimeMs = (course.quizTime || 60) * 60 * 1000;
    const now = new Date();
    const start = progress.sectionAssessment?.lastAttempt;

    // Add 1-minute grace period for network latency
    if (start && (now.getTime() - new Date(start).getTime()) > (maxTimeMs + 60000)) {
      return res.status(400).json({ error: 'Assessment time limit exceeded.' });
    }

    const questions = course.questions || [];
    let score = 0;
    const wrongAnswers = [];

    // Create a map of questionId to answer for easier lookup
    const answerMap = {};
    answers.forEach(answer => {
      answerMap[answer.questionId] = answer.answer;
    });

    questions.forEach((question, index) => {
      const userAnswer = answerMap[question._id.toString()];
      if (userAnswer && userAnswer === question.correctAnswer) {
        score++;
      } else {
        // Track wrong answers with question number (1-based index)
        wrongAnswers.push({
          questionNumber: index + 1,
          userAnswer: userAnswer || "No answer",
          correctAnswer: question.correctAnswer,
          question: question.question
        });
      }
    });

    // Calculate pass status (e.g., 80% or stay with absolute if preferred, but relative is safer for variable counts)
    // The previous pass mark was 25 out of 30 (approx 83%). Let's use 80% as a standard.
    const passPercentage = 80;
    const passed = (score / questions.length) * 100 >= passPercentage;

    // Update assessment results
    progress.sectionAssessment = progress.sectionAssessment || {};
    progress.sectionAssessment.attempts = (progress.sectionAssessment.attempts || 0) + 1;
    progress.sectionAssessment.score = score;
    progress.sectionAssessment.passed = passed;
    progress.sectionAssessment.timeSpent = Math.round((now - (start || now)) / 60000);
    progress.sectionAssessment.lastAttempt = now;
    await progress.save();

    res.json({
      score,
      passed,
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

    // Check if section exists and if it is empty
    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Use unique video IDs for consistency
    const allVideoIds = [...new Set(
      section.units
        .map(u => normalizeVideoId(u.videoID))
        .filter(id => id !== '')
    )];
    const totalVideos = allVideoIds.length;
    const numQuestions = course.questions ? course.questions.length : 0;
    const timeLimit = course.quizTime || 60;

    const progress = await UserProgress.findOne({ user: userId, course: courseId, section: sectionId });

    if (totalVideos === 0) {
      return res.json({
        sectionProgress: 100,
        unitComplete: true,
        sectionComplete: true,
        courseName: course.courseName,
        numQuestions: numQuestions,
        timeLimit: timeLimit,
        assessment: progress ? progress.sectionAssessment : null
      });
    }

    // Calculate actual progress on-the-fly
    const watchedVideos = progress ? progress.completedVideos : [];
    const watchedCount = allVideoIds.filter(id =>
      watchedVideos.some(v => normalizeVideoId(v) === id)
    ).length;
    const actualProgress = Math.round((watchedCount / totalVideos) * 100);
    const isComplete = watchedCount >= totalVideos;
    const hasQuestions = course.questions && course.questions.length > 0;
    const assessmentPassed = progress?.sectionAssessment?.passed || (!hasQuestions && isComplete);

    res.json({
      sectionProgress: isComplete ? 100 : actualProgress,
      unitComplete: isComplete,
      sectionComplete: isComplete,
      assessmentPassed: assessmentPassed,
      courseName: course.courseName,
      numQuestions: numQuestions,
      timeLimit: timeLimit,
      assessment: progress ? progress.sectionAssessment : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all courses with detailed status for the current user
export const getUserCourseStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    // Get all courses
    const courses = await Course.find().sort({ createdAt: 1 }).populate('sections');

    const courseStatus = [];
    let previousCourseCompleted = true; // First course is always unlocked

    for (const course of courses) {
      let allSectionsVideosFinished = true;
      let courseAssessmentPassed = (course.questions && course.questions.length > 0) ? false : true;
      let totalCourseVideos = 0;
      let completedCourseVideos = 0;
      let sectionsCount = 0;
      const totalSections = course.sections?.length || 0;

      if (totalSections > 0) {
        for (const section of course.sections) {
          // Count unique videos in section
          const sectionVideoIds = [...new Set(
            section.units
              .map(u => normalizeVideoId(u.videoID))
              .filter(id => id !== '')
          )];
          totalCourseVideos += sectionVideoIds.length;

          const progress = await UserProgress.findOne({
            user: userId,
            course: course._id,
            section: section._id
          });

          if (progress) {
            sectionsCount++;
            // Count completed videos in this section
            const completedInSection = sectionVideoIds.filter(id =>
              progress.completedVideos.some(v => normalizeVideoId(v) === id)
            ).length;
            completedCourseVideos += completedInSection;

            if (!progress.sectionComplete) {
              allSectionsVideosFinished = false;
            }
            if (progress.sectionAssessment?.passed) {
              courseAssessmentPassed = true;
            }
          } else {
            // No progress record yet for this section
            if (sectionVideoIds.length > 0) {
              allSectionsVideosFinished = false;
            }
          }
        }
      } else {
        // No sections means it's "complete" by default or handled differently. 
        // But usually courses have sections.
        allSectionsVideosFinished = true;
      }

      // Final completion check: All sections' videos watched AND Assessment passed (if required)
      const isCompleted = totalSections > 0 && allSectionsVideosFinished && courseAssessmentPassed;

      // Roughly calculate duration (for UI)
      const durationMins = totalCourseVideos * 15;

      courseStatus.push({
        courseId: course._id,
        courseName: course.courseName,
        courseDetail: course.courseDetail,
        isUnlocked: previousCourseCompleted,
        isCompleted: isCompleted,
        totalSectionsCount: totalSections,
        totalVideosCount: totalCourseVideos,
        completedVideosCount: completedCourseVideos,
        duration: durationMins,
        courseImage: course.courseImage
      });

      // The next course is unlocked only if the current one is fully passed/completed
      previousCourseCompleted = isCompleted;
    }

    res.json(courseStatus);
  } catch (error) {
    console.error("Error in getUserCourseStatus:", error);
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
    const progress = await UserProgress.findOne({
      user: userId,
      course: courseId,
      section: sectionId.toString() // 🔑 FORCE MATCH
    });

    console.log("FOUND PROGRESS:", progress);

    res.json(progress || { completedVideos: [] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};




