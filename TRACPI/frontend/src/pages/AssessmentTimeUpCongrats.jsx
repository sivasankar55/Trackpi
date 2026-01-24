import React from 'react';

function AssessmentTimeUpCongrats({ onUnlock }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-[2px] px-4">
      <div
        className="relative w-full max-w-[1152px] h-auto min-h-[320px] rounded-[30px] p-[40px] md:p-[60px] text-white flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(262.57deg, #3F280D 0.01%, #070B20 100.01%)",
        }}
      >
        <div className="relative z-10 flex flex-col items-center text-center w-full">
          {/* Icon and Title */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl md:text-4xl text-white">⏰</span>
            <h2 className="text-2xl md:text-3xl font-bold">Time’s Up!</h2>
          </div>

          {/* Success Message */}
          <div className="mb-10 space-y-1">
            <p className="text-base md:text-lg font-medium">
              Your assessment time has ended, But you’ve successfully passed the assessment.
            </p>
            <p className="text-base md:text-lg font-medium">
              You’re one step closer to your goal!
            </p>
          </div>

          {/* Subtext */}
          <p className="text-xs md:text-sm text-gray-200 max-w-[700px] mb-12">
            When you are ready to start the next course, Just unlock the next course
          </p>

          {/* Action Button */}
          <div className="flex justify-center w-full">
            <button
              onClick={onUnlock}
              className="w-full md:w-[280px] py-3.5 rounded-full bg-[#FFA726] text-white font-bold hover:bg-[#FB8C00] transition-all shadow-lg"
            >
              Unlock Next Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentTimeUpCongrats;
