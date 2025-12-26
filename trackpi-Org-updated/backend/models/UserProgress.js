import mongoose from 'mongoose';

const sectionAssessmentSchema = new mongoose.Schema({
  attempts: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  timeSpent: { type: Number, default: 0 }, // in minutes
  lastAttempt: { type: Date }
}, { _id: false });

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  completedVideos: [{ type: String }], // array of video IDs or names
  unitComplete: { type: Boolean, default: false },
  sectionAssessment: sectionAssessmentSchema,
  sectionComplete: { type: Boolean, default: false },
  sectionProgress: { type: Number, default: 0 }, // percent complete
  courseProgress: { type: Number, default: 0 }, // percent complete
  currentSection: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
}, { timestamps: true });

export default mongoose.model('UserProgress', userProgressSchema); 