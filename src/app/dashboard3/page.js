import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardContent3 from './DashboardContent3'

export default async function Dashboard3Page() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  return <DashboardContent3 user={user} />
}