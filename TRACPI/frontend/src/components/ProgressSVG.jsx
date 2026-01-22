import React, { useState, useEffect } from 'react';

const ProgressSVG = ({ percentage = 0 }) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  // Animate percentage from 0 to target value on load/change
  useEffect(() => {
    const animationDuration = 1000; // 1 second animation
    const framesPerSecond = 60;
    const totalFrames = (animationDuration / 1000) * framesPerSecond;
    const increment = (percentage - displayPercentage) / totalFrames;

    let currentFrame = 0;
    const interval = setInterval(() => {
      currentFrame++;
      setDisplayPercentage(prev => {
        const next = prev + increment;
        if (currentFrame >= totalFrames) {
          clearInterval(interval);
          return percentage;
        }
        return next;
      });
    }, 1000 / framesPerSecond);

    return () => clearInterval(interval);
  }, [percentage]);

  const center = { x: 101, y: 100 };
  const radiusProgress = 85;
  const radiusTicks = 66;
  const radiusKnob = 10;
  const circumferenceProgress = 2 * Math.PI * radiusProgress;
  const circumferenceTicks = 2 * Math.PI * radiusTicks;

  const safePercentage = Math.max(0, Math.min(100, displayPercentage));

  // Calculate knob position - Starting exactly from the BOTTOM (90 degrees) and moving CLOCKWISE
  const angle = (safePercentage / 100) * 360 + 90;
  const knobX = center.x + radiusProgress * Math.cos((angle * Math.PI) / 180);
  const knobY = center.y + radiusProgress * Math.sin((angle * Math.PI) / 180);

  // Growth lengths for progress
  const progressFilled = (safePercentage / 100) * circumferenceProgress;
  const ticksFilled = (safePercentage / 100) * circumferenceTicks;

  return (
    <svg width="201" height="232" viewBox="0 0 201 232" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Center Circle Gradient: #BC6B00 to #925300 */}
        <linearGradient id="centerGradient" x1="101" y1="36" x2="101" y2="166" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BC6B00" />
          <stop offset="1" stopColor="#925300" />
        </linearGradient>

        {/* Progress Arc Gradient: #FF9407 */}
        <linearGradient id="progressGradient" x1="101" y1="15" x2="101" y2="185" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9407" />
          <stop offset="1" stopColor="#FF9407" stopOpacity="0.5" />
        </linearGradient>

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Mask for Ticks Progress - Starts at bottom, moves clockwise */}
        <mask id="ticksMask">
          <circle
            cx={center.x}
            cy={center.y}
            r={radiusTicks}
            stroke="white"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${ticksFilled} ${circumferenceTicks}`}
            transform={`rotate(90 ${center.x} ${center.y})`}
          />
        </mask>
      </defs>


      {/* Background Track (Subtle Ghost Arc) */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radiusProgress}
        stroke="#FF9407"
        strokeOpacity="0.1"
        strokeWidth="16"
        fill="none"
      />

      {/* Background Ticks (Faint Grey) */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radiusTicks}
        stroke="#FFFFFF"
        strokeOpacity="0.1"
        strokeWidth="10"
        fill="none"
        strokeDasharray="1 2.5"
      />

      {/* Active Progress Ticks (Bright Orange) */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radiusTicks}
        stroke="#FF9407"
        strokeWidth="10"
        fill="none"
        strokeDasharray="1 2.5"
        mask="url(#ticksMask)"
      />

      {/* Solid Progress Arc - Starts at 6 o'clock, fills strictly CLOCKWISE */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radiusProgress}
        stroke="url(#progressGradient)"
        strokeWidth="16"
        fill="none"
        strokeDasharray={`${progressFilled} ${circumferenceProgress}`}
        strokeLinecap="round"
        transform={`rotate(90 ${center.x} ${center.y})`}
      />

      {/* Knob at the LEAD EDGE (End point of progress) */}
      <circle
        cx={knobX}
        cy={knobY}
        r={radiusKnob}
        fill="#BC6B00"
        stroke="#FF9407"
        strokeWidth="2"
        filter="url(#glow)"
      />

      {/* Center Circle Content Area */}
      <circle cx={center.x} cy={center.y} r="60" fill="url(#centerGradient)" stroke="#FF9407" strokeOpacity="0.3" strokeWidth="2" />

      {/* Percentage Text - Centered */}
      <text
        x={center.x}
        y={center.y + 12}
        fill="white"
        fontSize="36"
        fontWeight="bold"
        textAnchor="middle"
        style={{ fontFamily: 'Inter, sans-serif', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
      >
        {Math.round(safePercentage)}%
      </text>

    </svg>
  );
};

export default ProgressSVG;