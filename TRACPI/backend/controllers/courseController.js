import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Enrollment from '../models/Enrollment.js';

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
    const { courseName, courseDetail, sections, questions } = req.body;

    // 1. Create the Course first
    const course = new Course({
      courseName,
      courseDetail,
      sections: [],
      questions: questions || []
    });
    const savedCourse = await course.save();

    // 2. Process properties and create sections
    if (sections && Array.isArray(sections) && sections.length > 0) {
      const createdSectionIds = [];

      for (const sectionData of sections) {
        // Map units from frontend structure to backend schema
        const mappedUnits = (sectionData.units || []).map(unit =
          ({
            unitName: unit.name || unit.unitName,
            unitDescription: unit.description || unit.unitDescription,
            videoID: unit.videoId || unit.videoID
          }));

        // Create new Section linked to this course
        const newSection = new Section({
          sectionName: sectionData.name || sectionData.sectionName,
          units: mappedUnits,
          course: savedCourse._id
        });

        const savedSection = await newSection.save();
        createdSectionIds.push(savedSection._id);
      }

      // Update course with section references
      savedCourse.sections = createdSectionIds;
      await savedCourse.save();
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
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('sections');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//delete course by id
export const deleteCourseById = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
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