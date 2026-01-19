import React from 'react';

const ProgressSVG = ({ percentage = 0 }) => {
  // Use original dimensions to ensure layout compatibility
  const width = 201;
  const height = 232;
  const centerX = width / 2;
  const centerY = 100; // Keep the circle centered vertically in the upper part

  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  // Safe percentage
  const safePercentage = Math.min(Math.max(Number(percentage) || 0, 0), 100);
  const offset = circumference - (safePercentage / 100) * circumference;

  // Knob position calculation
  // Percentage 0 is at 6 o'clock (90deg)
  const startAngle = 90;
  const currentAngle = startAngle + (safePercentage / 100) * 360;
  const angleRad = (currentAngle * Math.PI) / 180;

  const knobX = centerX + radius * Math.cos(angleRad);
  const knobY = centerY + radius * Math.sin(angleRad);

  // Ticks calculation - higher density for premium look
  const ticks = [];
  const numTicks = 150;
  for (let i = 0; i < numTicks; i++) {
    const tickAngle = startAngle + (i / numTicks) * 360;
    const tickRad = (tickAngle * Math.PI) / 180;
    const innerR = radius - 15;
    const outerR = radius - 6;

    const x1 = centerX + innerR * Math.cos(tickRad);
    const y1 = centerY + innerR * Math.sin(tickRad);
    const x2 = centerX + outerR * Math.cos(tickRad);
    const y2 = centerY + outerR * Math.sin(tickRad);

    const isCompleted = (i / numTicks) * 100 <= safePercentage;

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isCompleted ? "#FF9D00" : "#2A2A2A"}
        strokeWidth="1"
        style={{ transition: 'stroke 0.3s' }}
      />
    );
  }

  return (
    <div className="relative flex items-center justify-center dashboard-progress-wrapper" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="progressGradientArc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9D00" />
            <stop offset="100%" stopColor="#BC6B00" />
          </linearGradient>
        </defs>

        {/* Outer dashed ring - dash-dot pattern */}
        {/* <circle
          cx={centerX}
          cy={centerY}
          r={radius + 28}
          fill="none"
          stroke="#444"
          strokeWidth="1"
          strokeDasharray="12 4 2 4"
          opacity="0.4"
        /> */}

        {/* Middle decorative ring */}
        {/* <circle
          cx={centerX}
          cy={centerY}
          r={radius + 18}
          fill="none"
          stroke="#333"
          strokeWidth="1.5"
          opacity="0.5"
        /> */}

        {/* Ticks Ring */}
        <g>{ticks}</g>

        {/* Background Track (thin dark ring) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#1A1A1A"
          strokeWidth={strokeWidth}
        />

        {/* Progress Arc */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="url(#progressGradientArc)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(90 ${centerX} ${centerY})`}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          filter="url(#glowEffect)"
        />

        {/* Knob */}
        <g style={{ transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <circle
            cx={knobX}
            cy={knobY}
            r="9"
            fill="#BC6B00"
            stroke="#FF9D00"
            strokeWidth="2"
          />
        </g>

        {/* Center Container */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius - 20}
          fill="#8D5104"
          stroke="#BC6B00"
          strokeWidth="1"
        />

        {/* Percentage Text */}
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          fill="white"
          fontSize="30"
          fontWeight="bold"
          className="itim"
          style={{ fontFamily: "'Itim', cursive, sans-serif" }}
        >
          {Math.round(safePercentage)}%
        </text>
      </svg>
    </div>
  );
};

export default ProgressSVG;