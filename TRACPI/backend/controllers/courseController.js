import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Enrollment from '../models/Enrollment.js';

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

    // Estimate total hours: 15 mins per unit
    const totalMinutes = totalUnits * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = `${hours}:${minutes.toString().padStart(2, '0')}`;

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

    // 1. Create the Course
    const course = new Course({
      courseName,
      courseDetail,
      sections: [],
      questions: parsedQuestions,
      quizTime: Number(quizTime) || 60
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
          videoID: unit.videoId || unit.videoID
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
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get course by id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('sections');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
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
          videoID: unit.videoId || unit.videoID
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
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        courseName,
        courseDetail,
        questions: parsedQuestions,
        quizTime: Number(quizTime),
        sections: createdSectionIds
      },
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
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Also delete associated sections
    await Section.deleteMany({ course: req.params.id });

    res.json({ message: 'Course and related sections deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCoursesWithGlobalStats = async (req, res) => {
  try {
    const courses = await Course.find().populate('sections');
    const allEnrollments = await Enrollment.find();

    const globalStats = {
      totalEnrolled: allEnrollments.length,
      notStarted: 0,
      completed: 0,
      inProgress: 0
    };

    allEnrollments.forEach(e => {
      if (e.progress === 0) globalStats.notStarted++;
      else if (e.progress === 100) globalStats.completed++;
      else globalStats.inProgress++;
    });

    const coursesWithStats = courses.map(course => {
      const courseEnrollments = allEnrollments.filter(e => e.course.toString() === course._id.toString());

      const completedCount = courseEnrollments.filter(e => e.progress === 100).length;
      const inProgressCount = courseEnrollments.filter(e => e.progress > 0 && e.progress < 100).length;

      let totalUnits = 0;
      if (course.sections) {
        course.sections.forEach(s => totalUnits += (s.units?.length || 0));
      }
      // estimated 15 mins per unit
      const totalMinutes = totalUnits * 15;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      // Format duration, e.g. "2 Hours" or "2h 30m" -> Keeping it simple as per UI "5 Hours"
      const duration = hours > 0 ? `${hours} Hours` : `${minutes} Mins`;

      return {
        ...course.toObject(),
        stats: {
          completed: completedCount,
          inProgress: inProgressCount
        },
        duration: duration
      };
    });

    res.json({
      globalStats,
      courses: coursesWithStats
    });

  } catch (error) {
    console.error("Error getting courses with stats:", error);
    res.status(500).json({ error: error.message });
  }
}; 