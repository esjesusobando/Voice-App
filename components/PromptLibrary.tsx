
import React, { useState } from 'react';
import { Prompt, Category } from '../types';

interface PromptLibraryProps {
  prompts: Prompt[];
  onDelete: (id: string) => void;
}

const CATEGORIES: Category[] = ['Marketing', 'Ventas', 'Dev', 'Design', 'Cloud', 'Data Lab', 'Visualización', 'Cyberseguridad'];

const PromptLibrary: React.FC<PromptLibraryProps> = ({ prompts, onDelete }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');

  const filteredPrompts = activeCategory === 'Todos' 
    ? prompts 
    : prompts.filter(p => p.category === activeCategory);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="px-6 pb-32 pt-2">
      {/* Categorías Minimalistas */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-8 mb-4">
        <button
          onClick={() => setActiveCategory('Todos')}
          className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${activeCategory === 'Todos' ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/5'}`}
        >
          Todos
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/5'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
           <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Sin Prompts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPrompts.map(prompt => (
            <div 
              key={prompt.id} 
              className="p-6 bg-white ny-border rounded-2xl group hover:border-black/20 transition-all active-scale"
            >
              <div className="flex justify-between items-center mb-5">
                <span className="text-[8px] font-black text-black uppercase tracking-[0.2em] bg-[#bef264] px-2.5 py-1 rounded-sm">
                  {prompt.category}
                </span>
                <button 
                  onClick={() => { if(confirm('¿Eliminar?')) onDelete(prompt.id); }}
                  className="text-black/10 hover:text-red-500 transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                </button>
              </div>
              <p className="text-black/60 font-medium text-[14px] leading-snug mb-8 line-clamp-4 tracking-tight">
                {prompt.text}
              </p>
              <button
                onClick={() => copyToClipboard(prompt.text)}
                className="w-full py-4 bg-slate-50 text-black rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all"
              >
                Copy Prompt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptLibrary;
