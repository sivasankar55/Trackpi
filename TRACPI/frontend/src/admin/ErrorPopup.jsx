import React, { useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorPopup = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-[400px] bg-white rounded-[20px] p-6 flex flex-col items-center text-center shadow-[0px_10px_40px_rgba(0,0,0,0.2)]"
                style={{ border: '1px solid rgba(226, 0, 0, 0.2)' }}
            >
                {/* Error Icon */}
                <div className="w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <FiAlertCircle className="text-[#E20000] text-3xl" />
                </div>

                <h2 className="text-xl font-black text-[#333] mb-2">Attention Needed</h2>

                <p className="text-gray-600 text-sm mb-6 px-2 font-medium">
                    {message || 'Please fix the errors before proceeding.'}
                </p>

                {/* Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-[12px] bg-[#E20000] hover:bg-[#C10000] text-white font-bold transition-all text-sm shadow-[0px_4px_15px_rgba(226,0,0,0.25)] active:scale-95"
                >
                    Okay, I'll Fix It
                </button>
            </div>
        </div>
    );
};

export default ErrorPopup;
