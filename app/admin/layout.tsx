import Sidebar from '@/components/admin/Sidebar';

export const metadata = { title: 'Admin — Green BD Environmental Solutions' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fbfd' }}>
      <Sidebar />
      <main className="ml-[240px] min-h-screen p-8">{children}</main>
    </div>
  );
}
