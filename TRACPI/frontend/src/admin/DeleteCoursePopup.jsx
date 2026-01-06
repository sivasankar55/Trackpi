import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const DeleteCoursePopup = ({ onClose, onConfirm, courseName, loading }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] backdrop-blur-sm p-4">
            <div className="relative w-full max-w-[450px] bg-white rounded-[25px] p-8 flex flex-col items-center text-center shadow-[0px_10px_40px_rgba(0,0,0,0.2)]"
                style={{ border: '1px solid rgba(255, 179, 0, 0.3)' }}
            >
                {/* Warning Icon */}
                <div className="w-20 h-20 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <FiAlertTriangle className="text-[#FF4B4B] text-4xl" />
                </div>

                <h2 className="text-2xl font-black text-[#333] mb-3">Delete Course?</h2>

                <p className="text-gray-500 text-sm mb-2 px-4">
                    Are you sure you want to delete <span className="font-bold text-[#FF9D00]">"{courseName}"</span>?
                </p>
                <p className="text-red-500/80 text-xs font-bold bg-red-50 px-4 py-2 rounded-lg mb-8">
                    This action creates a permanent deletion and cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-[15px] bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-all text-sm active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-[15px] bg-[#FF4B4B] hover:bg-[#E63939] text-white font-bold transition-all text-sm shadow-[0px_4px_15px_rgba(255,75,75,0.3)] active:scale-95"
                    >
                        {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCoursePopup;
