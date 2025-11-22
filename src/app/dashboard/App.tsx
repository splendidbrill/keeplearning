// "use client";
// import React from 'react';
// import { useStore } from './store';
// import { Dashboard } from './components/Dashboard';
// import { BookPage } from './components/BookPage';

// function App() {
//   const { activeBook, setActiveBook } = useStore();

//   // Render Book Page if a book is active
//   if (activeBook) {
//     return <BookPage book={activeBook} onBack={() => setActiveBook(null)} />;
//   }

//   // Render Dashboard
//   return <Dashboard />;
// }

// export default App;

import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { ClientWrapper } from './components/ClientWrapper';


export default async function DashboardPage() {
  const supabase = await createClient();
  
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  // Pass user data to the client component
  return <ClientWrapper user={user} />;
  
}