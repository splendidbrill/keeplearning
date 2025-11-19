
export interface Book {
  id: string;
  title: string;
  author?: string;
  description?: string;
  color: string;
  file?: File | null;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  color: string; // Hex code for the dot
  bookCount: number;
  isActive: boolean;
  progress: number;
  recentBooks: Book[];
}

export interface Stats {
  subjects: number;
  totalBooks: number;
  completed: number;
  progress: number;
}

export interface StoreState {
  stats: Stats;
  subjects: Subject[];
  activeBook: Book | null;
  addSubject: (subject: { name: string; color: string; description?: string }) => void;
  updateSubject: (id: string, data: { name: string; color: string; description?: string }) => void;
  deleteSubject: (id: string) => void;
  addBook: (subjectId: string, book: { title: string; author?: string; description?: string; file?: File | null }) => void;
  updateBook: (subjectId: string, bookId: string, data: { title: string; author?: string; description?: string }) => void;
  deleteBook: (subjectId: string, bookId: string) => void;
  setActiveBook: (book: Book | null) => void;
}
