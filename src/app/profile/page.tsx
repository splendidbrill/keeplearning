import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/app/profile/components/ProfileForm';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return <ProfileForm user={user} />;
}