import React from 'react';

function AssessmentFailedPopup({ wrongAnswers = [], onGoBack, onRetake }) {
  return (
    <>
      <div
        className="fixed top-[24vh] left-[5vw] w-[90vw] md:left-[13vw] md:w-[75vw] max-w-[1152px] h-auto md:h-[60vh] rounded-[30px] p-6 md:p-10 text-white flex flex-col items-center justify-center gap-6 md:gap-10 z-50 shadow-lg"
        style={{
          background: "linear-gradient(262.57deg, #3F280D 0.01%, #070B20 100.01%)",
        }}
      >
        <div className="text-center ml-1">
         <h2 className="text-xl  md:text-2xl font-bold flex items-center justify-center gap-2">
  <span className="not-italic  font-sans">⚠️</span>
  Assessment Not Passed
</h2>

          <p className="mt-2 text-sm md:text-base">
            Thanks for taking the assessment.
            <br />
            You didn’t pass this time, but you’re getting closer!
          </p>
        </div>

        <div className="text-center">
          <p className="mb-4 font-semibold text-sm md:text-base">
            Questions you got wrong:
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {wrongAnswers.length > 0 ? (
              wrongAnswers.map((wrongAnswer) => (
                <div
                  key={wrongAnswer.questionNumber}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white flex items-center justify-center text-base md:text-lg font-semibold"
                  title={`Q${wrongAnswer.questionNumber}: Your answer: ${wrongAnswer.userAnswer}, Correct: ${wrongAnswer.correctAnswer}`}
                >
                  {wrongAnswer.questionNumber}
                </div>
              ))
            ) : (
              <span className="text-gray-400">None</span>
            )}
          </div>
        </div>

        <p className="text-center text-sm md:text-base max-w-md md:max-w-xl">
          Take a moment to review the course content, then try again when you're ready.
        </p>

        <div className="flex justify-center items-center gap-2 w-full max-w-[300px] whitespace-nowrap mx-auto">
          <button
            className="border border-yellow-400 text-white text-xs px-3 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition w-[135px]"
            onClick={onGoBack}
          >
            Go to Course
          </button>
          <button
            className="bg-yellow-400 text-white text-xs px-3 py-3 rounded-full hover:bg-yellow-300 transition font-semibold w-[135px]"
            onClick={onRetake}
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </>
  );
}

export default AssessmentFailedPopup;