import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: '',
    },
    hearAboutUs: {
        type: String,
        default: 'Other',
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Contact', contactSchema);
