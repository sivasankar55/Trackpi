import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  adminType: {
    type: String,
    enum: ['admin', 'super admin', 'editor'],
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: ''
  },
  lastLogin: {
    type: Date,
    default: null
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  suspendedUntil: {
    type: Date,
    default: null
  }
}, { timestamps: true });

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined; // Remove confirmPassword from DB
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Admin', AdminSchema); 