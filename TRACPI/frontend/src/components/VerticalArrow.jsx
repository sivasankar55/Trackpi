import React from 'react';

const VerticalArrow = ({ className, height = "80" }) => (
    <svg
        className={className}
        width="20"
        height={height}
        viewBox={`0 0 20 ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Vertical Line */}
        <line
            x1="10"
            y1="0"
            x2="10"
            y2={height - 10}
            stroke="#FF9D00"
            strokeOpacity="0.5"
            strokeWidth="2"
        />
        {/* Arrowhead */}
        <path
            d={`M3 ${height - 12} L10 ${height} L17 ${height - 12}`}
            stroke="#FF9D00"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default VerticalArrow;
