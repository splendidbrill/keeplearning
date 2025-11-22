import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Dashboard4Content from './Dashboard4Content'

export default async function Dashboard4Page() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  return <Dashboard4Content user={user} />
}