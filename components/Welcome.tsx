
import React from 'react';
import Logo from './Logo';

interface WelcomeProps {
  onComplete: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  return (
    <div 
      onClick={onComplete}
      className="flex-1 flex flex-col items-center justify-center cursor-pointer p-8 text-center animate-in fade-in duration-700"
    >
      <div className="mb-20">
        <Logo scale={1.2} />
      </div>
      
      <div className="mt-12 opacity-30">
        <div className="w-10 h-1 bg-black mb-3"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.6em]">Analog Capture System</p>
      </div>
      
      <div className="mt-32 animate-pulse text-[10px] font-black text-black/25 uppercase tracking-[0.4em]">
        Tap to Start Recording
      </div>
    </div>
  );
};

export default Welcome;
