import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, required: false },
    googleId: { type: String, required: false, unique: true, sparse: true },
    phoneNumber: { type: String, required: false },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    suspendedUntil: {
        type: Date,
        default: null
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema); 