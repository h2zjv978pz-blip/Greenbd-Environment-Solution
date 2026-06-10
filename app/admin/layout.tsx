import AdminShell from '@/components/admin/AdminShell';

export const metadata = { title: 'Admin — Green BD Environmental Solutions' };

// Admin pages must never be statically cached/CDN-cached — stale or
// RSC-payload responses served as HTML breaks the login/dashboard.
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
