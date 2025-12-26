import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseDetail: {
    type: String,
    required: true,
    trim: true
  },
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  }]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema); 