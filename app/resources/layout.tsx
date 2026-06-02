import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/getData';

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  return (
    <>
      <Header settings={settings} />
      <main className="pt-24 min-h-screen bg-gray-50">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
