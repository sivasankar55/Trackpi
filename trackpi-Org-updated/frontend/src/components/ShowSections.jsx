import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import "./css/WaveAnimation.css";

const WIDTH = 260;
const HEIGHT = 150;
const WAVE_AMPLITUDE = 3;
const WAVE_LENGTH = 80;
const WAVE_SPEED = 1.5;

const ShowSections = () => {
  const { courseId } = useParams();

  const [progress, setProgress] = useState();
  const [phase, setPhase] = useState(0);





  const navigate = useNavigate();
  const pathRef = useRef();

    // Draw the wave path
    const drawWave = (progress, phase) => {
      const fillLevel = HEIGHT - (progress / 100) * HEIGHT;
      let d = `M0,${fillLevel}`;
      for (let x = 0; x <= WIDTH; x += 2) {
        const y =
          fillLevel +
          Math.sin((x / WAVE_LENGTH) * 2 * Math.PI + phase) * WAVE_AMPLITUDE;
        d += ` L${x},${y}`;
      }
      d += ` L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;
      if (pathRef.current) {
        pathRef.current.setAttribute("d", d);
      }
    };

    // Animation loop
 useEffect(() => {
  let localPhase = phase;
  let animationFrameId;

  const animate = () => {
    localPhase += 0.04 * WAVE_SPEED;
    drawWave(progress, localPhase);
    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationFrameId);
  // eslint-disable-next-line
}, [progress]);

   // Redraw wave if progress changes
   useEffect(() => {
    drawWave(progress, phase);
    // eslint-disable-next-line
  }, [progress]);


  

  return (
    <div className="text-white mt-5">
      <div className="my-5 px-5 flex justify-between gap-5 lg:justify-end">
        <button className="rounded-[40px] px-12.5 py-3 bg-[#FF9D00] text-white text-[12px] sm:text-base font-medium cursor-pointer roboto">
          Courses
        </button>
        <button className="rounded-[40px] px-12.5 py-3 border border-[#FF9D00] text-[#FF9D00]  font-medium sm:text-base cursor-pointer roboto">
          Assessment
        </button>
      </div>

      {/* progress section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {selectedCourse.sections.map((section, i) => (
  <div 
    key={section._id}
    onClick={() => navigate(`/video-section/${section._id}`)}
    className="progress-bar-container"
  >
    <div className="progress-bar relative flex flex-col items-center justify-center py-8">
      {/* Section number in background */}
      <span className="absolute top-4 left-4 text-[55px] sm:text-[75px] text-white/10 font-bold z-0 select-none">
        {i + 1}
      </span>
      {/* Section title */}
      <h3 className="text-xl sm:text-2xl font-bold text-white text-center z-10 mb-2">
        {section.title}
      </h3>
      {/* Videos and duration */}
      <div className="flex items-center justify-center gap-3 text-lg sm:text-xl font-medium text-white z-10">
        <span>{section.videos.length} Videos</span>
        <span className="mx-1">|</span>
        <span>{section.duration} Min</span>
      </div>
      {/* Wave SVG */}
      <svg
        id="wave"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full"
      >
        <path ref={pathRef} fill="url(#waveGradient)" />
        <defs>
          <linearGradient
            id="waveGradient"
            x1="0"
            y1={HEIGHT / 2}
            x2={WIDTH}
            y2={HEIGHT / 2}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0866666" stopColor="#17005E" />
            <stop offset="1" stopColor="#FF9D00" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
))}
        
            



          </div>
    </div>
  );
};

export default ShowSections;
