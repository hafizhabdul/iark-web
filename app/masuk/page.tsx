import { Header, Footer } from '@/components/layout';
import { SignInForm } from '@/components/features/auth';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-white py-12 md:py-20 px-4">
        <SignInForm />
      </main>

      <Footer />
    </div>
  );
}
