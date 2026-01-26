import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const AssessmentBubble = ({ currentPage, setCurrentPage, totalPages = 30 }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallMobile = windowWidth < 390;
  const isMobile = windowWidth < 768;
  const visibleCount = isSmallMobile ? 3 : isMobile ? 5 : 16;

  let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
  let end = start + visibleCount - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - visibleCount + 1);
  }

  const visiblePages = Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, i) => start + i
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="text-white font-inter w-full h-auto">
      {/* Title */}
      <div className="flex ml-[6vw] mt-[5vh]">
        <div className="font-roboto font-medium text-[24px] md:text-[1.95vw] leading-[1] tracking-normal text-left">
          Assessment
        </div>
      </div>

      {/* Bubble Row */}
      <div className="mt-8 ml-[6vw] w-[88vw] h-auto flex items-center justify-between gap-y-4">
        {/* Capsule with 1 and < */}
        <div className="flex items-center border border-white/90 rounded-full px-[0px] flex-shrink-0">
          <button
            onClick={() => setCurrentPage(1)}
            className={`${isSmallMobile ? 'w-[32px] h-[36px]' : 'w-[40px] h-[44px]'} flex items-center justify-center text-white text-[16px] sm:text-[18px] 
              ${currentPage === 1 ? 'text-yellow-500 font-semibold' : ''}`}
          >
            1
          </button>
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`${isSmallMobile ? 'w-[36px] h-[36px]' : 'w-[44px] h-[44px]'} flex items-center justify-center rounded-full border border-white/80
              ml-[4px] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-[14px] sm:text-[18px] text-white"
            />
          </button>
        </div>

        {/* Bubbles */}
        <nav className={`flex ${isSmallMobile ? 'gap-x-[4px]' : 'gap-x-[8px] sm:gap-x-[2vw]'} justify-center flex-1`}>
          {visiblePages
            .filter((item) => item !== 1 && item !== totalPages)
            .map((item) => {
              const isActive = item === currentPage;
              return (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`${isSmallMobile ? 'w-[36px] h-[36px] text-[14px]' : 'w-[44px] h-[44px] text-[18px]'} rounded-full border font-medium text-center 
                flex items-center justify-center
                ${isActive
                      ? 'border-yellow-500 text-yellow-500'
                      : 'border-white/90 text-white'
                    }`}
                >
                  {item}
                </button>
              );
            })}
        </nav>
        {/* Capsule with > and last */}
        <div className="flex items-center border border-white/90 rounded-full px-[0px] flex-shrink-0">
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`${isSmallMobile ? 'w-[36px] h-[36px]' : 'w-[44px] h-[44px]'} flex items-center justify-center rounded-full border border-white/90
              mr-[4px] ${currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : ''
              }`}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-[14px] sm:text-[18px] text-white"
            />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`${isSmallMobile ? 'w-[36px] h-[36px]' : 'w-[40px] h-[44px]'} flex items-center justify-center text-white text-[16px] sm:text-[18px] 
              ${currentPage === totalPages
                ? 'text-yellow-500 font-semibold'
                : ''
              }`}
          >
            {totalPages}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentBubble;


