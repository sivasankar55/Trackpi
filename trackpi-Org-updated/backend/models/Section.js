import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  unitName: {
    type: String,
    required: true,
    trim: true
  },
  unitDescription: {
    type: String,
    required: true,
    trim: true
  },
  videoID: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
    trim: true
  },
  units: [unitSchema],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Section', sectionSchema); 