
import React from 'react';
import { JournalEntry } from '../types';
import Logo from './Logo';

interface EntryDetailProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const EntryDetail: React.FC<EntryDetailProps> = ({ entry, onDelete, onBack }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-400">
      <div className="px-8 pt-6 pb-4 flex justify-between items-center">
         <button onClick={onBack} className="text-black/40 hover:text-black">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
         </button>
         <Logo scale={0.4} />
      </div>

      <div className="flex-1 px-8 py-2 overflow-y-auto no-scrollbar">
        <div className="bg-[#fffef2] p-8 border border-black/5 shadow-xl relative min-h-[300px]">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ 
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}></div>

            <div className="relative">
                <header className="mb-8 flex justify-between items-start border-b border-black/5 pb-4">
                    <span className="font-['Permanent_Marker'] text-2xl text-black/70">{entry.date}</span>
                    <div className="flex flex-col items-end opacity-30">
                        <span className="text-[9px] font-black uppercase">SIDE A</span>
                        <span className="text-[9px] font-bold">HIFI</span>
                    </div>
                </header>
                
                <p className="font-['Courier_Prime'] text-lg text-black/75 leading-relaxed italic">
                    {entry.text || "NO DATA DETECTED"}
                </p>
            </div>
        </div>
      </div>

      <div className="pb-12 px-8 mt-4 flex flex-col gap-4">
        <button 
          onClick={() => { if(confirm('Eject and destroy this archive?')) onDelete(entry.id); }}
          className="w-full py-3 border border-black/10 text-black/30 font-bold uppercase text-[9px] tracking-[0.4em] hover:text-red-600 transition-all"
        >
          Destroy Tape
        </button>
      </div>
    </div>
  );
};

export default EntryDetail;
