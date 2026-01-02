import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const AssessmentBubble = ({ currentPage, setCurrentPage }) => {
  const totalPages = 30;
  const [isMobile, setIsMobile] = useState(false);
  const visibleCount = isMobile ? 5 : 16;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
  let end = start + visibleCount - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - visibleCount + 1);
  }

  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="background-b text-white font-inter w-screen h-auto">
      {/* Title */}
      <div className="flex ml-[6vw] mt-[5vh]">
        <div className="w-[10vw] h-[4.58vh] font-roboto font-medium text-[1.95vw] leading-[1] tracking-normal text-center max-[768px]:text-[4vw]">
          Assessment
        </div>
      </div>

      {/* Bubble Row */}
      <div className="absolute top-[15.6vh] ml-[5vw] w-[90vw] h-[7.5vh] flex items-center gap-[2vw] justify-start">
        {/* Capsule with 1 and < */}
        <div className="flex items-center border border-white/90 rounded-full px-[0px]">
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-[40px] h-[44px] flex items-center justify-center text-white text-[18px] 
              ${currentPage === 1 ? 'text-yellow-500 font-semibold' : ''}`}
          >
            1
          </button>
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`w-[44px] h-[44px] flex items-center justify-center rounded-full border border-white/80
              ml-[4px] ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-[18px] text-white"
            />
          </button>
        </div>

        {/* Bubbles (2 to 29) */}
        <nav className="flex gap-x-[2vw]">
          {visiblePages
            .filter((item) => item !== 1 && item !== 30)
            .map((item) => {
              const isActive = item === currentPage;
              return (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`w-[44px] h-[44px] rounded-full border font-medium text-center 
                flex items-center justify-center text-[18px]
                ${
                  isActive
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-white/90 text-white'
                }`}
                >
                  {item}
                </button>
              );
            })}
        </nav>
        {/* Capsule with > and 30 */}
        <div className="flex items-center border border-white/90 rounded-full px-[0px]">
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`w-[44px] h-[44px] flex items-center justify-center rounded-full border border-white/90
              mr-[4px] ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-[18px] text-white"
            />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`w-[44px] h-[44px] flex items-center justify-center text-white text-[18px] 
              ${
                currentPage === totalPages
                  ? 'text-yellow-500 font-semibold'
                  : ''
              }`}
          >
            30
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentBubble;
