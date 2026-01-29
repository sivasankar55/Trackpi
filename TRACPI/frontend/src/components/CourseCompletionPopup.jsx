import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCompletionPopup = ({ onClose }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[110] px-4">
            <div
                className="w-[90vw] md:w-[75vw] max-w-[800px] rounded-[30px] p-8 md:p-12 flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden text-center"
                style={{
                    background: 'linear-gradient(262.57deg, #3F280D 0.01%, #070B20 100.01%)'
                }}
            >
                <div className="absolute top-0 right-0 w-[50%] h-full bg-[#3F280D]/40 blur-[100px] translate-x-1/4" />

                <h2 className="text-2xl md:text-4xl font-bold mb-4 z-10">
                    🎉 Congratulations! 🎉
                </h2>
                <p className="text-lg md:text-xl font-medium mb-8 z-10 max-w-lg">
                    You have successfully completed all the courses! You are now ready to start your onboarding process.
                </p>

                <button
                    onClick={() => {
                        navigate('/start-course/dashboard');
                        if (onClose) onClose();
                    }}
                    className="bg-[#FF9D00] text-white font-bold px-10 py-3 rounded-full hover:bg-[#FF8A00] transition-all duration-300 transform hover:scale-105 shadow-lg text-lg z-10"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default CourseCompletionPopup;
