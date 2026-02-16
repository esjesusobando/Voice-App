
import React from 'react';
import { JournalEntry } from '../types';
import Logo from './Logo';

interface HomeProps {
  entries: JournalEntry[];
  onOpenEntry: (entry: JournalEntry) => void;
  onStartRecording: () => void;
}

const TAPE_COLORS = ['tape-cream', 'tape-silver', 'tape-rust', 'tape-blue-muted', 'tape-brown'];

const Home: React.FC<HomeProps> = ({ entries, onOpenEntry, onStartRecording }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Branding Header */}
      <div className="px-8 pt-6 pb-4 flex justify-between items-start">
        <Logo scale={0.65} />
        <div className="text-right">
           <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em]">Archive</p>
           <p className="text-[10px] font-bold text-black/15">{entries.length} TAPES</p>
        </div>
      </div>

      {/* Tape Stack */}
      <div className="flex-1 px-8 py-2 overflow-y-auto no-scrollbar">
        {entries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-10">
             <div className="mb-8 scale-75 grayscale"><Logo /></div>
             <p className="text-[9px] font-bold uppercase tracking-[0.4em]">System Ready</p>
          </div>
        ) : (
          <div className="flex flex-col pb-20">
            {entries.map((entry, index) => {
              const colorClass = TAPE_COLORS[index % TAPE_COLORS.length];
              return (
                <div 
                  key={entry.id} 
                  className={`tape-spine ${colorClass}`}
                  onClick={() => onOpenEntry(entry)}
                >
                  <div className="tape-spine-label">{entry.date}</div>
                  <div className="ml-auto flex items-center gap-4 opacity-40">
                    <div className="flex flex-col items-end">
                      <span className="text-[7px] font-black">SIDE A</span>
                      <span className="text-[8px] font-bold">HIFI</span>
                    </div>
                    <div className="w-1 h-10 bg-black/20 rounded-full"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Global Record Control */}
      <div className="pb-10 flex flex-col items-center gap-3 bg-gradient-to-t from-black/5 to-transparent">
        <button 
          onClick={onStartRecording}
          className="record-button-tactile"
        />
        <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.5em]">Press Record</span>
      </div>
    </div>
  );
};

export default Home;
