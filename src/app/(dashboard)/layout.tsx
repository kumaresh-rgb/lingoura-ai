import { AuthGuard } from '@/shared/auth/guards/AuthGuard';
import { DashboardLayout } from '@/shared/layouts/DashboardLayout';

export default function RootDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
