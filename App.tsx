
import React, { useState, useEffect } from 'react';
import { JournalEntry, AppView } from './types';
import Home from './components/Home';
import Recorder from './components/Recorder';
import EntryDetail from './components/EntryDetail';
import Welcome from './components/Welcome';

const STORAGE_KEY = 'cassette_journal_final_v1';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('welcome');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntry = (text: string) => {
    if (!text.trim()) {
      setView('home');
      return;
    }
    const dateObj = new Date();
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: dateObj.getTime(),
      text: text,
      title: text.split(' ').slice(0, 3).join(' ') || 'Voice Log'
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setView('home');
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSelectedEntry(null);
    setView('home');
  };

  return (
    <div className="retro-surface">
      {/* Notch / Dynamic Island */}
      <div className="dynamic-island"></div>

      {/* Status Bar */}
      <div className="w-full h-8 flex justify-between items-end px-10 pb-1 z-50">
        <span className="text-[12px] font-bold">9:41</span>
        <div className="flex gap-1 items-center">
            <div className="w-4 h-2 bg-black/10 rounded-sm"></div>
            <div className="w-4 h-2 bg-black/40 rounded-sm"></div>
            <div className="w-6 h-3 border border-current rounded-sm flex items-center px-0.5">
                <div className="h-1.5 w-full bg-current rounded-sm"></div>
            </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {view === 'welcome' && (
          <Welcome onComplete={() => setView('home')} />
        )}

        {view === 'home' && (
          <Home 
            entries={entries} 
            onOpenEntry={(e) => { setSelectedEntry(e); setView('entry-detail'); }}
            onStartRecording={() => setView('recording')}
          />
        )}

        {view === 'recording' && (
          <Recorder 
            onSave={saveEntry} 
            onCancel={() => setView('home')} 
          />
        )}

        {view === 'entry-detail' && selectedEntry && (
          <EntryDetail 
            entry={selectedEntry} 
            onDelete={deleteEntry} 
            onBack={() => setView('home')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
