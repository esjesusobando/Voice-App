
import React from 'react';
import { AppView, JournalEntry } from '../types';

interface HeaderProps {
  view: AppView;
  onBack: () => void;
  entries: JournalEntry[];
}

const Header: React.FC<HeaderProps> = ({ view, onBack, entries }) => {
  if (view === 'welcome') return null;

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const tapeCount = entries.length;

  return (
    <header className="px-8 pt-10 pb-6 flex items-start justify-between border-b border-gray-100">
      <div className="flex flex-col items-start cursor-pointer" onClick={view !== 'home' ? onBack : undefined}>
        <div className="flex flex-col items-start">
          <h1 className="logo-main">cassette</h1>
          <div className="logo-underline"></div>
          <div className="logo-underline mt-[2px] opacity-50"></div>
          <div className="logo-underline mt-[2px] opacity-25"></div>
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{today}</span>
        <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">{tapeCount} TAPES</span>
      </div>
    </header>
  );
};

export default Header;
