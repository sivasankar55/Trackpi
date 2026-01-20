import React from 'react';
import curvedArrowImg from '../assets/curved-arrow-mobile.png';

const CurvedArrow = ({ className }) => (
    <div className={`flex items-center justify-center ${className}`}>
        <img
            src={curvedArrowImg}
            alt="Curved Arrow"
            className="w-[80px] h-auto object-contain opacity-80"
        />
    </div>
);

export default CurvedArrow;
