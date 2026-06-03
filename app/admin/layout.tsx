import AdminShell from '@/components/admin/AdminShell';

export const metadata = { title: 'Admin — Green BD Environmental Solutions' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
