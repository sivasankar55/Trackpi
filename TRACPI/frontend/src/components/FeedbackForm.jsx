import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import CourseCompletionPopup from './CourseCompletionPopup';

const FeedbackForm = () => {
    const [ratings, setRatings] = useState({
        quality: 0,
        smoothness: 0,
        clarity: 0,
    });
    const [experience, setExperience] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [validationError, setValidationError] = useState('');
    const [showCompletionPopup, setShowCompletionPopup] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isFinalFeedback = location.state?.isFinalFeedback;

    const handleStarClick = (category, rating) => {
        setRatings((prev) => ({ ...prev, [category]: rating }));
    };

    const getRatingLabel = (rating) => {
        const labels = {
            1: { text: 'Poor', emoji: '😠' },
            2: { text: 'Fair', emoji: '☹️' },
            3: { text: 'Good', emoji: '😊' },
            4: { text: 'Very Good', emoji: '😄' },
            5: { text: 'Excellent', emoji: '😍' },
        };
        return labels[rating] || { text: 'Select', emoji: '⭐' };
    };

    const questions = [
        { id: 1, key: 'quality', text: '1. How would you rate the quality of the course content?' },
        { id: 3, key: 'smoothness', text: '3. Did the platform perform smoothly during the course?' },
        { id: 2, key: 'clarity', text: '2. How would you rate the instructor’s clarity and teaching style?' },
    ];

    const handleSubmit = async () => {
        if (ratings.quality === 0 || ratings.smoothness === 0 || ratings.clarity === 0 || !experience.trim()) {
            setValidationError('Please complete all ratings and share your experience before submitting.');
            return;
        }
        setValidationError('');

        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/feedback', {
                quality: ratings.quality,
                smoothness: ratings.smoothness,
                clarity: ratings.clarity,
                experience
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (isFinalFeedback) {
                setShowCompletionPopup(true);
            } else {
                setShowForm(false);
                // Redirect back to specific course or generic list
                const courseId = location.state?.courseId;
                if (courseId) {
                    navigate(`/course-section/${courseId}`);
                } else {
                    navigate('/course-section');
                }
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        }
    };

    if (showCompletionPopup) {
        return <CourseCompletionPopup />;
    }

    if (!showForm) return null;

    return (
        <div className="w-full min-h-screen bg-[#0a0a0a] p-4 flex items-center justify-center font-['Inter',_sans-serif]">
            <div className="w-full max-w-[800px] px-2 sm:px-4">
                <div
                    className="w-full rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/5"
                    style={{
                        background: "linear-gradient(105deg, #0F1021 0%, #0A0B1A 40%, #2D1B0A 100%)",
                    }}
                >
                    <div className="mb-6 sm:mb-8 text-center">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">We Value Your Feedback</h1>
                        <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm max-w-sm mx-auto">Help us improve your learning experience.</p>
                    </div>

                    <div className="flex flex-col gap-5 sm:gap-6">
                        {questions.map((q) => (
                            <div key={q.id} className="flex flex-col gap-3">
                                <h3 className="text-white text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-tight">
                                    {q.text}
                                </h3>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5 w-full">
                                    <div className="flex gap-1.5 sm:gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                size={22}
                                                className={`cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-90 ${star <= ratings[q.key]
                                                    ? 'text-[#FDCB02]'
                                                    : 'text-[#FFFFFF33]'
                                                    }`}
                                                onClick={() => handleStarClick(q.key, star)}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[#FFFFFFCC] text-[12px] sm:text-[13px] md:text-[14px] font-medium flex items-center gap-1.5 min-w-[80px] sm:min-w-[90px]">
                                        {getRatingLabel(ratings[q.key]).text}{' '}
                                        <span className="text-base sm:text-lg">{getRatingLabel(ratings[q.key]).emoji}</span>
                                    </span>
                                </div>
                            </div>
                        ))}

                        <div className="flex flex-col gap-3 mt-1">
                            <h3 className="text-white text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-tight">
                                4. Can you share your experience?
                            </h3>
                            <div className="relative">
                                <textarea
                                    className="w-full bg-[#FFFFFF0D] border border-[#FFFFFF26] rounded-[15px] p-4 sm:p-5 text-white placeholder-[#FFFFFF33] focus:outline-none focus:border-[#FFA726]/50 min-h-[90px] sm:min-h-[100px] resize-none transition-all text-[11px] sm:text-xs md:text-sm leading-relaxed italic"
                                    placeholder="Tell us what you liked or how we can improve..."
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                />
                            </div>
                            {validationError && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{validationError}</p>
                            )}
                        </div>

                        <div className="flex justify-center mt-2 sm:mt-4">
                            <button
                                onClick={handleSubmit}
                                className="w-full sm:w-auto px-10 py-3 rounded-full bg-[#FF9D00] text-white text-[14px] sm:text-[15px] font-bold hover:bg-[#FF8A00] transition-all duration-300 shadow-[0_4px_15px_rgba(255,157,0,0.3)] active:scale-95"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
