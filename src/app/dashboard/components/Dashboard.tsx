"use client";
import React, { useState } from 'react';
import { Book, BookOpen, CheckCircle, BarChart2, Plus, Clock, Library, TrendingUp } from 'lucide-react';
import { useStore } from '../store';
import { StatCard } from './StatCard';
import { SubjectCard } from './SubjectCard';
import { QuickActionCard } from './QuickActionCard';
import { AddSubjectModal } from './AddSubjectModal';
import { AddBookModal } from './AddBookModal';
import { ConfirmationModal } from './ConfirmationModal';
import { Subject, Book as BookType } from '../types';

export const Dashboard: React.FC = () => {
  const { 
    stats, 
    subjects, 
    addSubject, 
    updateSubject, 
    deleteSubject, 
    addBook, 
    updateBook, 
    deleteBook, 
    setActiveBook 
  } = useStore();
  
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  
  const [bookModalState, setBookModalState] = useState<{ isOpen: boolean; subjectId: string | null; editBook?: BookType | null }>({
    isOpen: false,
    subjectId: null,
    editBook: null
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ 
    isOpen: boolean; 
    type: 'subject' | 'book' | null; 
    id: string | null; 
    subjectId?: string; 
    name: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: ''
  });

  // --- Subject Handlers ---
  const handleAddSubject = (data: { name: string; color: string; description: string }) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data);
      setEditingSubject(null);
    } else {
      addSubject(data);
    }
    setIsSubjectModalOpen(false);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubjectRequest = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    if (subject) {
      setDeleteConfirm({
        isOpen: true,
        type: 'subject',
        id,
        name: subject.name
      });
    }
  };

  // --- Book Handlers ---
  const handleAddBookClick = (subjectId: string) => {
    setBookModalState({ isOpen: true, subjectId, editBook: null });
  };

  const handleEditBook = (subjectId: string, book: BookType) => {
    setBookModalState({ isOpen: true, subjectId, editBook: book });
  };

  const handleSaveBook = (data: { title: string; author: string; description: string; file: File | null }) => {
    if (bookModalState.subjectId) {
      if (bookModalState.editBook) {
        updateBook(bookModalState.subjectId, bookModalState.editBook.id, data);
      } else {
        addBook(bookModalState.subjectId, data);
      }
      setBookModalState({ isOpen: false, subjectId: null, editBook: null });
    }
  };

  const handleDeleteBookRequest = (subjectId: string, bookId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    const book = subject?.recentBooks.find(b => b.id === bookId);
    if (book) {
      setDeleteConfirm({
        isOpen: true,
        type: 'book',
        id: bookId,
        subjectId,
        name: book.title
      });
    }
  };

  // --- Confirm Delete ---
  const handleConfirmDelete = () => {
    if (deleteConfirm.type === 'subject' && deleteConfirm.id) {
      deleteSubject(deleteConfirm.id);
    } else if (deleteConfirm.type === 'book' && deleteConfirm.id && deleteConfirm.subjectId) {
      deleteBook(deleteConfirm.subjectId, deleteConfirm.id);
    }
    setDeleteConfirm({ ...deleteConfirm, isOpen: false });
  };

  const addingBookSubjectName = subjects.find(s => s.id === bookModalState.subjectId)?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13002b] via-[#1e0a3c] to-[#0f0518] p-6 md:p-10 text-white selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <header>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 text-white">LearnFlow AI Tutor</h1>
          <p className="text-purple-300/80 text-sm md:text-base">AI-Powered Learning Management System</p>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Subjects" 
            value={stats.subjects} 
            icon={BookOpen} 
          />
          <StatCard 
            title="Total Books" 
            value={stats.totalBooks} 
            icon={Book} 
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            icon={CheckCircle} 
          />
          <StatCard 
            title="Progress" 
            value={`${stats.progress}%`} 
            icon={BarChart2}
            showProgressBar
            progressValue={stats.progress}
          />
        </section>

        {/* My Subjects Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-semibold">My Subjects</h2>
            <button 
              onClick={() => {
                setEditingSubject(null);
                setIsSubjectModalOpen(true);
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard 
                key={subject.id} 
                subject={subject} 
                onAddBook={handleAddBookClick}
                onBookClick={setActiveBook}
                onEditSubject={handleEditSubject}
                onDeleteSubject={handleDeleteSubjectRequest}
                onEditBook={handleEditBook}
                onDeleteBook={handleDeleteBookRequest}
              />
            ))}
          </div>
        </section>

        {/* Quick Actions Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              title="Schedule Lesson"
              description="Set up automated learning sessions"
              icon={Clock}
            />
            <QuickActionCard
              title="Browse Library"
              description="Access all your learning materials"
              icon={Library}
            />
            <QuickActionCard
              title="View Progress"
              description="Track your learning journey"
              icon={TrendingUp}
            />
          </div>
        </section>

        <AddSubjectModal 
          isOpen={isSubjectModalOpen}
          onClose={() => setIsSubjectModalOpen(false)}
          onAdd={handleAddSubject}
          initialData={editingSubject}
        />

        <AddBookModal
          isOpen={bookModalState.isOpen}
          onClose={() => setBookModalState({ ...bookModalState, isOpen: false })}
          subjectName={addingBookSubjectName}
          onAdd={handleSaveBook}
          initialData={bookModalState.editBook}
        />

        <ConfirmationModal 
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
          onConfirm={handleConfirmDelete}
          title={`Delete ${deleteConfirm.type === 'subject' ? 'Subject' : 'Book'}?`}
          message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        />

      </div>
    </div>
  );
}