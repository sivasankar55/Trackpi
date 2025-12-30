import React from 'react';

function AssessmentPassedPopup({ onUnlock}) {
  return (
    <>
      <div
        className="fixed top-[30vh] left-[15vw] w-[70vw] max-w-[1152px] h-auto md:h-[45vh] rounded-[30px] p-6 md:p-10 gap-6 md:gap-10 text-white flex flex-col items-center justify-center shadow-lg z-50"
        style={{
          background: "linear-gradient(262.57deg, #3F280D 0.01%, #070B20 100.01%)",
        }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-center">
          Congratulations 🎉
        </h2>

        <p className="text-center text-sm md:text-base">
          Congrats, you’ve successfully passed the assessment.
          <br />
          You’re one step closer to your goal!
        </p>

        <p className="text-center text-sm md:text-base">
          When you are ready to start the next course, just unlock the next course.
        </p>

        <button
         onClick={onUnlock}
         className="bg-yellow-400 text-white font-semibold px-6 py-2 rounded-full hover:bg-yellow-300 transition w-full md:w-auto">
          Unlock Next Section
        </button>
      </div>
    </>
  );
}

export default AssessmentPassedPopup;