import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    quality: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    smoothness: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    clarity: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    experience: {
        type: String,
        required: false,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Feedback', feedbackSchema);
