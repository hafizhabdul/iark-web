import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/masuk');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email, photo, role')
    .eq('id', user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        userName={profile?.name || ''}
        userEmail={profile?.email || ''}
        userAvatar={profile?.photo || undefined}
        isAdmin={profile?.role === 'admin'}
      />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
