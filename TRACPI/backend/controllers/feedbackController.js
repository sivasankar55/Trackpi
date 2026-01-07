import Feedback from '../models/Feedback.js';

// Submit new feedback
export const submitFeedback = async (req, res) => {
    try {
        const { quality, smoothness, clarity, experience } = req.body;

        // Basic validation
        if (!quality || !smoothness || !clarity) {
            return res.status(400).json({ message: 'All rating fields are required.' });
        }

        const newFeedback = new Feedback({
            quality,
            smoothness,
            clarity,
            experience
        });

        if (req.user) {
            newFeedback.user = req.user._id;
        }

        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
    }
};

// Get all feedback (for Admin)
export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('user', 'name avatar').sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Server error. Failed to fetch feedback.' });
    }
};
