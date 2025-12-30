import React from 'react'

function AssessmentTimeUpCongrats() {
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
            Your assessment time has ended, but you've successfully passed the assessment.
            <br />
            You’re one step closer to your goal!
          </p>
        </div>

        <p className="text-center text-xs md:text-sm">
          When you are ready to start the next course, just unlock the next course.
        </p>

        <div className="flex justify-center">
          <button className="px-6 md:px-10 py-3 md:py-3 rounded-full bg-[#FFA726] text-white font-semibold hover:bg-orange-400 transition w-full md:w-auto">
            Unlock Next Course
          </button>
        </div>
      </div>
    
    
    
    
    
    </>
  )
}

export default AssessmentTimeUpCongrats;