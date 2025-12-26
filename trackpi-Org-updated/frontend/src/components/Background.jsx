import React from 'react';

const Background = () => {
  const containerStyle = {
    position: 'fixed', // changed from fixed
    top: 0,
    left: 0,
    width: '100%',
    height: '100%', // changed from 100vh
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
    zIndex: -1,
  };

  const ellipseStyle = {
    position: 'absolute',
    top: '-20%',
    left: '-30%',
    width: '180%',
    height: '180%',
    borderRadius: '30%',
    WebkitBackdropFilter: 'blur(80px)',
    backdropFilter: 'blur(80px)',
    background: 'linear-gradient(225.01deg, #FF9D0066 0%, #000E4D4D 55%, #000E4DFF 100%)',
  };

  return (
    <div style={containerStyle}>
      <div style={ellipseStyle}></div>
    </div>
  );
};

export default Background;