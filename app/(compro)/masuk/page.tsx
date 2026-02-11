import { Suspense } from 'react';
import { SignInForm } from '@/components/features/auth';

export default function SignInPage() {
  return (
    <main className="flex-1 bg-gradient-to-br from-gray-50 to-white py-12 md:py-20 px-4">
      <Suspense>
        <SignInForm />
      </Suspense>
    </main>
  );
}
