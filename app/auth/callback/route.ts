import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // If explicit redirect provided, use it
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Otherwise, check user role and redirect accordingly
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch profile to check role
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        // Redirect admin to admin panel, others to dashboard
        const redirectPath = profile?.role === 'admin' ? '/admin' : '/dashboard';
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }

      // Fallback to dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/masuk?error=auth_callback_error`);
}
