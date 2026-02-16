
export type Category = 'Marketing' | 'Ventas' | 'Dev' | 'Design' | 'Cloud' | 'Data Lab' | 'Visualización' | 'Cyberseguridad';

export interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  text: string;
  title: string;
}

export interface Prompt {
  id: string;
  text: string;
  category: Category;
  timestamp: number;
}

export interface AudioBlob {
  data: string;
  mimeType: string;
}

export type AppView = 'welcome' | 'home' | 'recording' | 'entry-detail' | 'library';
