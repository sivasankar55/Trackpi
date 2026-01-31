import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                <div className="mt-4 text-center text-gray-600 font-medium">Loading...</div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
