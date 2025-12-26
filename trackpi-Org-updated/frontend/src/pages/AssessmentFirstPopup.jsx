import React from 'react';
import { useNavigate } from 'react-router-dom';

function AssessmentFirstPopup({ maxAttempts, onButtonClick }) {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="
          fixed top-1/2 left-1/2
          w-[75vw] max-w-[360px] max-h-[70vh]
          md:w-[60vw] md:max-w-[1152px] md:h-auto
          -translate-x-1/2 -translate-y-1/2
          rounded-[30px]
          p-4 md:p-[40px]
          flex flex-col gap-6 md:gap-[40px]
          bg-[linear-gradient(262.57deg,_#3F280D_0.01%,_#070B20_100.01%)]
          shadow-lg z-50 text-white
        "
      >
        <div
          className="
            overflow-y-auto
            scrollbar-none
            md:overflow-visible
          "
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Heading */}
          <div className="w-full flex flex-col items-center gap-2 md:gap-[10px] text-center mb-3 md:mb-10">
            <h2 className="text-base md:text-2xl font-bold">This assessment has a time limit</h2>
            <p className="text-xs md:text-base">
              Your answers will automatically be submitted when the time limit is reached
            </p>
          </div>

          {/* Course Name and Info Boxes */}
          <div className="w-full flex flex-col items-center gap-[2vh]">
            <h2 className="text-sm md:text-lg font-semibold text-center">Course Name</h2>

            <div className="flex flex-col md:flex-row justify-between w-full gap-4 md:gap-[3vw]">
              <div className="flex flex-col items-center justify-center gap-2 h-[70px] md:h-[118px] border border-[#303030] rounded-[10px] px-4 md:px-[40px] py-3 md:py-[15px] text-center">
                <p className="font-medium text-sm md:text-base">Number of Questions</p>
                <p className="text-xl md:text-3xl font-bold">30</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 h-[70px] md:h-[118px] border border-[#303030] rounded-[10px] px-4 md:px-[70px] py-3 md:py-[15px] text-center">
                <p className="font-medium text-sm md:text-base">Time Allowed</p>
                <p className="text-xl md:text-3xl font-bold">
                  60 <span className="text-xs md:text-base font-medium">Minutes</span>
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 h-[70px] md:h-[118px] border border-[#303030] rounded-[10px] px-4 md:px-[40px] py-3 md:py-[15px] text-center">
                <p className="font-medium text-sm md:text-base">Number of attempts left</p>
                <p className="text-xl md:text-3xl font-bold">0{maxAttempts}</p>
              </div>
            </div>

            <p className="text-[10px] md:text-sm text-center mt-2 px-2">
              When you are ready to begin the assessment, just click the <strong>“Ok, Start Assessment”</strong> button below
            </p>
          </div>

          {/* Button */}
          <div className="flex justify-center mt-3 md:mt-8">
            <button
              onClick={onButtonClick}
              className="text-white font-semibold text-xs md:text-sm rounded-[40px] border border-black w-[90%] max-w-[217px] h-[38px] md:h-[43px] px-4 md:px-[20px] py-2 md:py-[12px] bg-[#FF9D00] hover:opacity-90 transition"
            >
              Ok, Start Assessment
            </button>
          </div>
        </div>

        <style>{`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-none {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
      </div>
    </>
  );
}

export default AssessmentFirstPopup;