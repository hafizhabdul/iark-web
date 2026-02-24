import { fetchDashboardStatsServer, fetchPendingStoriesServer } from '@/lib/queries/dashboard.server';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';

export default async function AdminDashboard() {
  const [stats, pendingStories] = await Promise.all([
    fetchDashboardStatsServer(),
    fetchPendingStoriesServer(),
  ]);

  return <AdminDashboardContent stats={stats} pendingStories={pendingStories} />;
}
