import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    unique: true,
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
  }],
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    quizType: String
  }],
  quizTime: {
    type: Number,
    default: 60
  },
  courseImage: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema); 