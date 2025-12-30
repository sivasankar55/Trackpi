import Section from '../models/Section.js';

export const createSection = async (req, res) => {
  try {
    const { sectionName, units, course } = req.body;
    const section = new Section({ sectionName, units, course });
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate('course');
    if (!section) return res.status(404).json({ error: 'Section not found' });
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSectionById = async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('course');
    if (!section) return res.status(404).json({ error: 'Section not found' });
    res.json(section);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSectionById = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ error: 'Section not found' });
    res.json({ message: 'Section deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('course');
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// get section by course id for user
export const getSectionsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ error: 'courseId is required' });
    const sections = await Section.find({ course: courseId });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 