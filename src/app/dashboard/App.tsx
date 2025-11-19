"use client";
import React from 'react';
import { useStore } from './store';
import { Dashboard } from './components/Dashboard';
import { BookPage } from './components/BookPage';

function App() {
  const { activeBook, setActiveBook } = useStore();

  // Render Book Page if a book is active
  if (activeBook) {
    return <BookPage book={activeBook} onBack={() => setActiveBook(null)} />;
  }

  // Render Dashboard
  return <Dashboard />;
}

export default App;