import React from 'react';

function AssessmentTimeUpPopup() {
  return (
    <>
      <div
        className="fixed top-[30vh] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[1152px] h-auto md:h-[320px] rounded-[30px] p-[20px] md:p-[40px] flex flex-col gap-[20px] md:gap-[30px] text-white"
        style={{
          background: "linear-gradient(262.57deg, #3F280D 0.01%, #070B20 100.01%)",
        }}
      >
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
            <span>⏰</span>
            <span>Time’s Up!</span>
          </div>
          <p className="mt-2 text-base md:text-lg">
            Your assessment time has ended.
            <br />
            Your answers have been automatically submitted.
          </p>
        </div>

        <p className="text-center text-xs md:text-sm">
          You’ll need to take the next attempt or rewatch the video sections before trying again.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button className="text-white font-bold px-6 md:px-10 py-3 md:py-3 border-2 border-orange-500 rounded-full hover:bg-orange-500 hover:text-black transition duration-300 w-full md:w-auto">
            Go to Course
          </button>

          <button className="px-6 py-3 md:py-3 rounded-full bg-[#FFA726] text-white font-semibold w-full md:w-auto">
            Retake Assessment
          </button>
        </div>
      </div>
    </>
  );
}

export default AssessmentTimeUpPopup;