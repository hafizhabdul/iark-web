'use client';

import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-white">
        <DashboardSidebar />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
