"use client";
import React from 'react';
import { useStore } from '../store';
import { Dashboard } from './Dashboard';
import { BookPage } from './BookPage';
import { User } from '@supabase/supabase-js';

interface ClientWrapperProps {
  user: User;
}

export const ClientWrapper: React.FC<ClientWrapperProps> = ({ user }) => {
  const { activeBook, setActiveBook } = useStore();

  // Render Book Page if a book is active (Full Screen Mode)
  if (activeBook) {
    return <BookPage book={activeBook} onBack={() => setActiveBook(null)} />;
  }

  // Render Dashboard with the Sidebar integration
  return <Dashboard user={user} />;
};