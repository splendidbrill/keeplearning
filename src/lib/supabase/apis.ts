import { createClient } from './client';
import { Subject, Book } from '@/app/dashboard/types';

const supabase = createClient();

// --- SUBJECTS ---

export const fetchUserData = async (): Promise<Subject[]> => {
  // Fetch subjects AND their related books in one query
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      *,
      books (*)
    `)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Transform database shape to your App's UI shape
  return data.map((subject: any) => ({
    id: subject.id,
    name: subject.name,
    color: subject.color,
    description: subject.description,
    bookCount: subject.books.length,
    recentBooks: subject.books, // You might want to slice this if you only want "recent"
    isActive: true, // Default state
    progress: 0 // You can calculate this later
  }));
};

export const addSubjectToDb = async (subject: { name: string; color: string; description: string }) => {
  const { data, error } = await supabase
    .from('subjects')
    .insert([{
      name: subject.name,
      color: subject.color,
      description: subject.description
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSubjectFromDb = async (id: string) => {
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (error) throw error;
};

// --- BOOKS ---

export const addBookToDb = async (
  subjectId: string, 
  book: { title: string; author: string; description: string; file: File | null }
) => {
  let fileUrl = null;

  // 1. Upload File if it exists
  if (book.file) {
    const fileExt = book.file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${subjectId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('book-files')
      .upload(filePath, book.file);

    if (uploadError) throw uploadError;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('book-files')
      .getPublicUrl(filePath);
    
    fileUrl = publicUrl;
  }

  // 2. Insert Book Record
  const { data, error } = await supabase
    .from('books')
    .insert([{
      subject_id: subjectId,
      title: book.title,
      author: book.author,
      description: book.description,
      file_url: fileUrl
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBookFromDb = async (bookId: string) => {
  const { error } = await supabase.from('books').delete().eq('id', bookId);
  if (error) throw error;
};