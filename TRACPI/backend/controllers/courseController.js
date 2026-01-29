import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';
import { calculateSectionDuration, calculateCourseDuration } from '../utils/videoUtils.js';

/**
 * Extremely robust parser that handles:
 * 1. Clean JSON
 * 2. Stringified JSON
 * 3. Mangled JS log strings (e.g. '[\n' + ' { ...')
 * 4. Objects/Arrays already in correct format
 * 
 * Returns a FLAT array of plain objects.
 */
/**
 * Extremely robust parser that handles:
 * 1. Clean Arrays/Objects
 * 2. Stringified JSON
 * 3. Mangled JS log strings (e.g. '[\n' + ' { ...')
 * 
 * Returns a FLAT array of plain objects.
 */
const robustParse = (data) => {
  if (!data) return [];

  // 1. If it's already an array, process each item and flatten
  if (Array.isArray(data)) {
    return data
      .map(item => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const obj = { ...item };
          if (obj.type && !obj.quizType) obj.quizType = obj.type;
          return obj;
        }
        return robustParse(item);
      })
      .flat()
      .filter(i => i && typeof i === 'object' && !Array.isArray(i));
  }

  // 2. If it's a plain object (not an array), return it in an array
  if (data && typeof data === 'object') {
    const obj = { ...data };
    if (obj.type && !obj.quizType) obj.quizType = obj.type;
    return [obj];
  }

  // 3. If it's a string, try various parsing strategies
  if (typeof data === 'string') {
    let s = data.trim();
    if (!s || s === 'undefined' || s === 'null') return [];

    // Helper to clean up JS-style mangled strings
    const cleanJS = (str) => {
      try {
        return str
          .replace(/(\r\n|\n|\r)/gm, "")        // remove newlines
          .replace(/\\n/g, "")                 // remove escaped newlines
          .replace(/'\s*\+\s*'/g, "")           // remove ' + '
          .replace(/"\s*\+\s*"/g, "")           // remove " + "
          .replace(/'/g, '"')                  // convert ' to "
          .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // quote keys
          .replace(/,\s*([\]}])/g, '$1');      // trailing commas
      } catch (e) { return str; }
    };

    try {
      // Try direct JSON
      const parsed = JSON.parse(s);
      return robustParse(parsed);
    } catch (e) {
      try {
        // Try cleaned JS
        const cleaned = cleanJS(s);
        const parsed = JSON.parse(cleaned);
        return robustParse(parsed);
      } catch (e2) {
        // Regex fallback: find { ... }
        const matches = s.match(/\{[^{}]+\}/g);
        if (matches) {
          return matches.map(m => {
            try {
              const parsedItem = JSON.parse(cleanJS(m));
              if (parsedItem && typeof parsedItem === 'object') {
                const obj = { ...parsedItem };
                if (obj.type && !obj.quizType) obj.quizType = obj.type;
                return obj;
              }
              return null;
            } catch (err) { return null; }
          }).filter(i => i && typeof i === 'object');
        }
      }
    }
  }

  return [];
};

export const getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const allSections = await Section.find();

    const totalSections = allSections.length;
    let totalUnits = 0;
    allSections.forEach(s => {
      totalUnits += (s.units?.length || 0);
    });

    // Total hours: Sum of all unit durations
    const sectionDurations = await Promise.all(allSections.map(s => calculateSectionDuration(s.units)));
    const totalMinutes = sectionDurations.reduce((a, b) => a + b, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = hours > 0 ? `${hours}h ${minutes}m` : `${totalMinutes} Mins`;

    const currentStudents = (await Enrollment.distinct('user')).length;

    res.json({
      totalCourses,
      totalSections,
      totalUnits,
      totalHours: formattedHours,
      currentStudents
    });
  } catch (error) {
    console.error("Error getting course stats:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    console.log("Creating new course...");
    const { courseName, courseDetail, sections, questions, quizTime } = req.body;

    const parsedQuestions = robustParse(questions);
    const parsedSections = robustParse(sections);

    console.log("Parsed Stats:", {
      courseName,
      sectionCount: parsedSections.length,
      questionCount: parsedQuestions.length,
      quizTime: quizTime
    });

    // Handle course image
    let courseImageUrl = '';
    if (req.file) {
      courseImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // 1. Create the Course
    const course = new Course({
      courseName,
      courseDetail,
      sections: [],
      questions: parsedQuestions,
      quizTime: Number(quizTime) || 60,
      courseImage: courseImageUrl
    });

    // Save once at the beginning
    const savedCourse = await course.save();
    console.log("Initial course saved:", savedCourse._id);

    // 2. Create Sections
    if (parsedSections && parsedSections.length > 0) {
      const createdSectionIds = [];

      for (const sectionData of parsedSections) {
        const mappedUnits = (sectionData.units || []).map(unit => ({
          unitName: unit.name || unit.unitName,
          unitDescription: unit.description || unit.unitDescription,
          videoID: unit.videoId || unit.videoID,
          unitDuration: Number(unit.duration || unit.unitDuration) || 0
        }));

        const newSection = new Section({
          sectionName: sectionData.name || sectionData.sectionName,
          units: mappedUnits,
          course: savedCourse._id
        });

        const savedSection = await newSection.save();
        createdSectionIds.push(savedSection._id);
      }

      // Update and save again with references
      savedCourse.sections = createdSectionIds;
      await savedCourse.save();
      console.log("Course updated with sections");
    }

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(400).json({ error: error.message });
  }
};

// get all course
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('sections');
    const coursesWithDuration = await Promise.all(courses.map(async course => {
      const durationMins = await calculateCourseDuration(course.sections);
      const h = Math.floor(durationMins / 60);
      const m = durationMins % 60;
      const durationStr = h > 0 ? `${h}h ${m}m` : `${durationMins} Mins`;
      return { ...course.toObject(), duration: durationStr };
    }));
    res.json(coursesWithDuration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get course by id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('sections');
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const durationMins = await calculateCourseDuration(course.sections);
    const h = Math.floor(durationMins / 60);
    const m = durationMins % 60;
    const durationStr = h > 0 ? `${h}h ${m}m` : `${durationMins} Mins`;

    res.json({ ...course.toObject(), duration: durationStr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update course by id
export const updateCourseById = async (req, res) => {
  try {
    const { courseName, courseDetail, sections, questions, quizTime } = req.body;
    const courseId = req.params.id;

    const parsedQuestions = robustParse(questions);
    const parsedSections = robustParse(sections);

    console.log(`Updating course ${courseId}...`, { quizTime });

    // 1. Delete old sections
    await Section.deleteMany({ course: courseId });

    // 2. Prepare Section IDs
    const createdSectionIds = [];
    if (parsedSections && parsedSections.length > 0) {
      for (const sectionData of parsedSections) {
        const mappedUnits = (sectionData.units || []).map(unit => ({
          unitName: unit.name || unit.unitName,
          unitDescription: unit.description || unit.unitDescription,
          videoID: unit.videoId || unit.videoID,
          unitDuration: Number(unit.duration || unit.unitDuration) || 0
        }));

        const newSection = new Section({
          sectionName: sectionData.name || sectionData.sectionName,
          units: mappedUnits,
          course: courseId
        });

        const savedSection = await newSection.save();
        createdSectionIds.push(savedSection._id);
      }
    }

    // 3. Update Course in one go
    const updateData = {
      courseName,
      courseDetail,
      questions: parsedQuestions,
      quizTime: Number(quizTime),
      sections: createdSectionIds
    };

    if (req.file) {
      updateData.courseImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    ).populate('sections');

    if (!updatedCourse) return res.status(404).json({ error: 'Course not found' });

    console.log("Course updated successfully");
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(400).json({ error: error.message });
  }
};
//delete course by id
export const deleteCourseById = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    // Also delete associated sections, enrollments, and progress
    await Promise.all([
      Section.deleteMany({ course: req.params.id }),
      Enrollment.deleteMany({ course: req.params.id }),
      UserProgress.deleteMany({ course: req.params.id })
    ]);

    res.json({ message: 'Course and all associated data deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCoursesWithGlobalStats = async (req, res) => {
  try {
    const courses = await Course.find().populate('sections');
    const allUsers = await User.find();
    const allEnrollments = await Enrollment.find().populate('user');

    const globalStats = {
      totalEnrolled: allUsers.length,
      notStarted: 0,
      completed: 0,
      inProgress: 0
    };

    const allUserProgress = await UserProgress.find();

    const validCourseIds = courses.map(c => c._id.toString());
    const totalCourseCount = validCourseIds.length;

    allUsers.forEach(user => {
      const userIdStr = user._id.toString();
      const userEnrollments = allEnrollments.filter(e =>
        e.user &&
        e.user._id.toString() === userIdStr &&
        e.course &&
        validCourseIds.includes(e.course.toString())
      );

      if (totalCourseCount === 0) {
        globalStats.notStarted++;
        return;
      }

      // Check for completion across ALL courses
      let allFinishedAndPassed = userEnrollments.length === totalCourseCount;
      if (allFinishedAndPassed) {
        for (const e of userEnrollments) {
          const courseRef = courses.find(c => c._id.toString() === e.course.toString());
          const hasQuestions = courseRef?.questions?.length > 0;
          const userRecords = allUserProgress.filter(up => up.user.toString() === userIdStr && up.course.toString() === e.course.toString());
          const passedAny = userRecords.some(up => up.sectionAssessment?.passed);

          if (e.progress < 100 || (hasQuestions && !passedAny)) {
            allFinishedAndPassed = false;
            break;
          }
        }
      }

      if (allFinishedAndPassed) {
        globalStats.completed++;
      } else {
        const hasFootprint = userEnrollments.some(e => e.progress > 0) ||
          allUserProgress.some(up => up.user.toString() === userIdStr && validCourseIds.includes(up.course.toString()));
        if (hasFootprint) {
          globalStats.inProgress++;
        } else {
          globalStats.notStarted++;
        }
      }
    });

    const coursesWithStats = await Promise.all(courses.map(async course => {
      const courseIdStr = course._id.toString();
      const courseEnrollments = allEnrollments.filter(e => e.course.toString() === courseIdStr);
      const hasQuestions = course.questions && course.questions.length > 0;

      const completedCount = courseEnrollments.filter(e => {
        const userProgress = allUserProgress.filter(up => up.user.toString() === e.user?._id?.toString() && up.course.toString() === courseIdStr);
        const passedAsmt = hasQuestions ? userProgress.some(up => up.sectionAssessment?.passed) : true;
        return e.progress === 100 && passedAsmt;
      }).length;

      const inProgressCount = courseEnrollments.length - completedCount;
      // Note: we can refine inProgressCount to only those with >0 progress if needed, 
      // but keeping it simple for now based on card UI needs. 
      // UI usually wants (Total - Completed) or specifically Started.
      // Re-filtering for accuracy with the Card UI which shows 'InProgress' specifically:
      const startedButNotFinished = courseEnrollments.filter(e => {
        const userProgress = allUserProgress.filter(up => up.user.toString() === e.user?._id?.toString() && up.course.toString() === courseIdStr);
        const isFinished = e.progress === 100 && (hasQuestions ? userProgress.some(up => up.sectionAssessment?.passed) : true);
        const hasStarted = e.progress > 0 || userProgress.length > 0;
        return hasStarted && !isFinished;
      }).length;

      const durationMins = await calculateCourseDuration(course.sections || []);
      const hours = Math.floor(durationMins / 60);
      const minutes = durationMins % 60;
      const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${durationMins} Mins`;

      return {
        ...course.toObject(),
        stats: {
          completed: completedCount,
          inProgress: startedButNotFinished
        },
        duration: durationStr
      };
    }));
    res.json({
      globalStats,
      courses: coursesWithStats
    });

  } catch (error) {
    console.error("Error getting courses with stats:", error);
    res.status(500).json({ error: error.message });
  }
}; 