export interface Note {
  id: string;
  title: string;
  content: string;
  language?: string; // for syntax highlighting
  createdAt: string;
  updatedAt: string;
  userId: string;
  collaborators: string[];
}

export interface Operation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  userId: string;
  timestamp: number;
}
