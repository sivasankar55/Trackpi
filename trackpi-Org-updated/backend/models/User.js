import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    googleId: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema); 