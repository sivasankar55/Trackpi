import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeedbackPopup = ({ onStart }) => {
    const navigate = useNavigate();

    const handleStart = () => {
        if (onStart) {
            onStart();
        } else {
            navigate('/feedback-form');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] px-4">
            <div
                className="w-[90vw] md:w-[75vw] max-w-[1150px] h-auto min-h-[25vh] md:h-[33vh] max-h-[350px] rounded-[30px] p-8 md:p-0 flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(to right, #070B20 0%, #3F280D 100%)'
                }}
            >
                <div className="absolute top-0 right-0 w-[50%] h-full bg-[#3F280D]/40 blur-[100px] translate-x-1/4" />

                <div className="flex flex-col items-center gap-1 md:gap-3 text-center z-10">
                    <h2
                        className="text-lg md:text-[24px] font-medium leading-tight"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Before you start the next Course,
                    </h2>
                    <p
                        className="text-base md:text-[24px] font-medium flex items-center gap-2"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        we would like to get some feedback from you 😊
                    </p>
                </div>

                <div className="mt-8 md:mt-12 z-10 w-full flex justify-center">
                    <button
                        onClick={handleStart}
                        className="bg-[#FF9D00] text-white font-bold px-12 md:px-20 py-1.5 md:py-2 rounded-[15px] md:rounded-full hover:bg-[#FF8A00] transition-all duration-300 transform hover:scale-105 shadow-[0_10px_30px_rgba(255,157,0,0.3)] active:scale-95 text-base md:text-xl"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPopup;
