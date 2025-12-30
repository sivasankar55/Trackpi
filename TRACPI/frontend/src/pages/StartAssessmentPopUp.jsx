
import React from "react";

const StartAssessmentPopUp = ({ onClose }) => {
  return (
    <div className="absolute -top-[0vh]  w-[51.04vw] h-[68.61vh] gap-[1.04vw]  ">
      <div className="w-[68.04vw] h-[66.19vh] px-[1.04vw] py-[1.39vh] rounded-[1.04vw] bg-[#3A3A3A] relative">
        <div className="w-[10.42vw] h-[16.83vh]  rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[35.8vw] h-[20vh] -ml-[24vh] gap-[2.1vw]  rounded-md">
            <div className="w-[33.4vw] h-[7.8vh] ml-[3vh] font-roboto font-semibold text-[1.15vw] leading-[3.9vh] tracking-[0] text-center text-white">
              Are you ready to start the assessment,<br /> or would you prefer to go over this section once more?
            </div>
            <div className="w-[22.4vw] h-[5.9vh] flex gap-[12px] ml-[6.8vh] mt-[3vh]">
              <div className="w-[20.9vw] h-[5.9vh] flex items-center gap-[10px] px-[30px] py-[12px] rounded-[40px] border border-white">
                {/* <!-- restart button--> */}
                <button
                  className="flex items-center gap-[0.52vw] text-white font-roboto font-medium text-[0.94vw] leading-[100%]"
                  onClick={onClose}
                >
                  <span className="w-[10.48vw] h-[1.95vh] text-center">Watch Again</span>
                </button>
              </div>
              <div className="w-[20.9vw] h-[5.9vh] flex items-center gap-[10px] px-[30px] py-[12px] rounded-[40px] border bg-[#FF9D00] border-[#FF9D00]">
                {/* <!-- play next button --> */}
                <button
                  className="flex items-center gap-[0.52vw] text-white font-roboto font-medium text-[0.94vw] leading-[100%]"
                  onClick={() => {
                    // Handle assessment unlock logic here
                    console.log("Unlock Assessment clicked");
                    onClose();
                  }}
                >
                  <span className="w-[10.48vw] h-[1.95vh] text-center"> Unlock Assessment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartAssessmentPopUp;