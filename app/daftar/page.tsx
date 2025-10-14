import { Header, Footer } from '@/components/layout';
import { SignUpForm } from '@/components/features/auth';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-white py-12 md:py-20 px-4">
        <SignUpForm />
      </main>

      <Footer />
    </div>
  );
}
