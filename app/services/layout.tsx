import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/getData';

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  return (
    <>
      <Header settings={settings} />
      <main className="min-h-screen bg-white">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
