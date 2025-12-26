import Course from '../models/Course.js';

export const createCourse = async (req, res) => {
  try {
    const { courseName, courseDetail, sections } = req.body;
    const course = new Course({ courseName, courseDetail, sections });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
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