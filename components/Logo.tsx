
import React from 'react';

interface LogoProps {
  scale?: number;
}

const Logo: React.FC<LogoProps> = ({ scale = 1 }) => {
  return (
    <div className="logo-box" style={{ transform: `scale(${scale})`, transformOrigin: 'left' }}>
      <h1 className="logo-wordmark">cassette</h1>
      <div className="logo-footer">
        <div className="logo-line"></div>
        <div className="logo-tag">Voice Journal</div>
      </div>
    </div>
  );
};

export default Logo;
