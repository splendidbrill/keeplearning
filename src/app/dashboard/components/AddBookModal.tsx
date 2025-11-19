
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Book } from '../types';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  onAdd: (data: { title: string; author: string; description: string; file: File | null }) => void;
  initialData?: Book | null;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, subjectName, onAdd, initialData }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setAuthor(initialData.author || '');
        setDescription(initialData.description || '');
        setFile(initialData.file || null);
      } else {
        setTitle('');
        setAuthor('');
        setDescription('');
        setFile(null);
      }
    }
  }, [isOpen, initialData]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({
      title,
      author,
      description,
      file
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel Wrapper */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-xl bg-[#1e1b2e] border border-white/10 text-left shadow-2xl transition-all w-full max-w-md my-8 animate-in fade-in zoom-in duration-200">
          
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-2 border-b border-white/5">
            <div>
              <h2 className="text-xl font-semibold text-white">{initialData ? 'Edit Book' : `Add Book to ${subjectName}`}</h2>
              <p className="text-gray-400 text-xs mt-1">
                {initialData ? 'Update book details.' : 'Add a book to this subject. PDF upload is optional.'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Book Title Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
                Book Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Organic Chemistry"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                required
              />
            </div>

            {/* Author Name Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., Dr. John Smith"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this book..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
            </div>

            {/* PDF File Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
                PDF File (Optional)
              </label>
              <div 
                className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="flex items-center gap-3 bg-purple-500/10 px-4 py-3 rounded-lg border border-purple-500/20">
                    <div className="bg-purple-500/20 p-2 rounded">
                      <Upload className="w-4 h-4 text-purple-300" />
                    </div>
                    <span className="text-sm font-medium text-purple-200 truncate max-w-[180px]">{file.name}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-gray-400 hover:text-red-400 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-white/5 p-3 rounded-full mb-3 group-hover:bg-white/10 transition-colors">
                      <Upload className="w-6 h-6 text-purple-300" />
                    </div>
                    <p className="text-gray-300 text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-xs mt-1">PDF files only (optional)</p>
                    <button 
                      type="button"
                      className="mt-4 bg-white/5 hover:bg-white/10 text-purple-200 text-xs font-medium px-4 py-2 rounded-md border border-white/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Select PDF
                    </button>
                  </>
                )}
              </div>
            </div>

            {!initialData && (
              <p className="text-[11px] text-gray-500 text-center pt-1">
                You can add the PDF file later. The book will be created with just the basic information.
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20"
              >
                {initialData ? 'Save Changes' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
