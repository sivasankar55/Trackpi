import Course from '../models/Course.js';
import Section from '../models/Section.js';

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
        const mappedUnits = (sectionData.units || []).map(unit => ({
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