  "use client";
  import React, { useState } from 'react';
  import { Book as BookIcon, MessageSquare, Send, List, X, ChevronLeft, BookOpen } from 'lucide-react';
  import { Book } from '../types';

  interface BookPageProps {
    book: Book;
    onBack: () => void;
  }

  export const BookPage: React.FC<BookPageProps> = ({ book, onBack }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
      <div className="flex h-screen bg-[#13002b] text-white overflow-hidden font-sans">
        {/* Table of Contents Sidebar Overlay */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#0f0518] border-r border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 flex items-center justify-between border-b border-white/10 h-16">
            <h2 className="font-semibold text-lg text-white">Table of Contents</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-gray-500 text-sm text-center italic mt-10">
              No chapters available yet.
            </div>
          </div>

          <div className="p-6 border-t border-white/10 bg-[#0f0518]">
            <button 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Overlay Backdrop for Mobile/Tablet when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Header */}
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#13002b] z-10 relative">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold truncate text-white">{book.title}</h1>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-200">0 Chapters</span>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 relative bg-gradient-to-br from-[#1e0a3c] via-[#16052b] to-[#0f0518] flex items-center justify-center overflow-hidden">
            {/* Table of Contents Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`absolute top-6 left-6 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all text-gray-200 z-20 ${
                isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <List className="w-4 h-4" />
              Table of Contents
            </button>

            {/* Empty State / Content Placeholder */}
            <div className="text-center p-8 animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                <BookIcon className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Select a chapter to start reading</h3>
              <p className="text-gray-400 text-sm">Use the Table of Contents to navigate through the book.</p>
            </div>
          </main>
        </div>

        {/* AI Tutor Sidebar (Right Panel) */}
        <div className="w-96 bg-[#13002b] border-l border-white/10 hidden lg:flex flex-col shrink-0 z-20 shadow-xl">
          <div className="p-6 border-b border-white/10 h-16 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-0.5">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <h2 className="font-semibold text-white text-sm">AI Tutor</h2>
            </div>
            <p className="text-[11px] text-gray-400">Ask questions about this chapter</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 rounded-bl-none border border-white/5">
              <MessageSquare className="w-7 h-7 text-purple-400/60" />
            </div>
            <h3 className="text-white font-medium mb-2">Start a conversation with your AI tutor</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
              Try asking: "Explain the main concepts in this chapter"
            </p>
          </div>

          <div className="p-4 border-t border-white/10 bg-[#0f0518]">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Ask about this chapter..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20 group-focus-within:scale-105 transform duration-200">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
