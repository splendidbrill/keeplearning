
import { create } from 'zustand';
import { StoreState, Subject, Book } from './types';

const initialSubjects: Subject[] = [
  {
    id: '1',
    name: 'Tushar Karan',
    color: '#fbbf24', // Amber/Yellow
    bookCount: 0,
    isActive: true,
    progress: 0,
    recentBooks: []
  },
  {
    id: '2',
    name: 'er',
    color: '#d8b4fe', // Light Purple
    bookCount: 2,
    isActive: true,
    progress: 0,
    recentBooks: [
      { id: 'b1', title: 'hi', color: '#4ade80' }, // Green icon
      { id: 'b2', title: 'or', color: '#f87171' }  // Red icon
    ]
  }
];

const BOOK_COLORS = ['#fbbf24', '#4ade80', '#f87171', '#60a5fa', '#c084fc', '#fb7185'];

export const useStore = create<StoreState>((set) => ({
  stats: {
    subjects: 2,
    totalBooks: 2,
    completed: 0,
    progress: 0,
  },
  subjects: initialSubjects,
  activeBook: null,
  
  addSubject: (newSubjectData) => set((state) => {
    const newSubject: Subject = {
      id: Math.random().toString(36).substring(2, 9),
      name: newSubjectData.name,
      description: newSubjectData.description,
      color: newSubjectData.color,
      bookCount: 0,
      isActive: true,
      progress: 0,
      recentBooks: []
    };

    return {
      subjects: [...state.subjects, newSubject],
      stats: {
        ...state.stats,
        subjects: state.stats.subjects + 1
      }
    };
  }),

  updateSubject: (id, data) => set((state) => ({
    subjects: state.subjects.map(sub => 
      sub.id === id 
        ? { ...sub, name: data.name, color: data.color, description: data.description }
        : sub
    )
  })),

  deleteSubject: (id) => set((state) => {
    const subjectToDelete = state.subjects.find(s => s.id === id);
    const bookCount = subjectToDelete ? subjectToDelete.bookCount : 0;

    return {
      subjects: state.subjects.filter(s => s.id !== id),
      stats: {
        ...state.stats,
        subjects: state.stats.subjects - 1,
        totalBooks: state.stats.totalBooks - bookCount
      }
    };
  }),

  addBook: (subjectId, bookDetails) => set((state) => {
    const randomColor = BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
    
    const newBook: Book = {
      id: Math.random().toString(36).substring(2, 9),
      title: bookDetails.title,
      author: bookDetails.author,
      description: bookDetails.description,
      color: randomColor,
      file: bookDetails.file
    };

    const updatedSubjects = state.subjects.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          bookCount: sub.bookCount + 1,
          recentBooks: [newBook, ...sub.recentBooks]
        };
      }
      return sub;
    });

    return {
      subjects: updatedSubjects,
      stats: {
        ...state.stats,
        totalBooks: state.stats.totalBooks + 1
      }
    };
  }),

  updateBook: (subjectId, bookId, data) => set((state) => ({
    subjects: state.subjects.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          recentBooks: sub.recentBooks.map(book => 
            book.id === bookId 
              ? { ...book, title: data.title, author: data.author, description: data.description }
              : book
          )
        };
      }
      return sub;
    })
  })),

  deleteBook: (subjectId, bookId) => set((state) => {
    const updatedSubjects = state.subjects.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          bookCount: sub.bookCount - 1,
          recentBooks: sub.recentBooks.filter(b => b.id !== bookId)
        };
      }
      return sub;
    });

    return {
      subjects: updatedSubjects,
      stats: {
        ...state.stats,
        totalBooks: state.stats.totalBooks - 1
      }
    };
  }),

  setActiveBook: (book) => set({ activeBook: book })
}));
