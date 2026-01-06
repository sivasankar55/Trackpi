import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const CourseSuccessPopup = ({ isOpen, onClose, mode }) => {
    if (!isOpen) return null;

    const isUpdate = mode === 'update';
    const title = isUpdate ? 'Course Updated!' : 'Course Launched!';
    const message = isUpdate
        ? 'Your course has been successfully updated and saved.'
        : 'Your course has been successfully created and is now live.';
    const buttonText = 'Continue to Dashboard';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] backdrop-blur-sm p-4">
            <div className="relative w-full max-w-[450px] bg-white rounded-[25px] p-8 flex flex-col items-center text-center shadow-[0px_10px_40px_rgba(0,0,0,0.2)]"
                style={{ border: '1px solid rgba(76, 175, 80, 0.3)' }}
            >
                {/* Success Icon */}
                <div className="w-20 h-20 bg-[#F0FFF4] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#C6F6D5]">
                    <FiCheckCircle className="text-[#48BB78] text-4xl" />
                </div>

                <h2 className="text-2xl font-black text-[#333] mb-3">{title}</h2>

                <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed font-medium">
                    {message}
                </p>

                {/* Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3.5 rounded-[15px] bg-[#48BB78] hover:bg-[#38A169] text-white font-bold transition-all text-sm shadow-[0px_4px_15px_rgba(72,187,120,0.3)] active:scale-95 uppercase tracking-wide"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default CourseSuccessPopup;
