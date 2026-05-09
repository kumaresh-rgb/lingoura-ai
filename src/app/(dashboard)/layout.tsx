import { DashboardLayout } from "@/components/DashboardLayout";

export default function RootDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
