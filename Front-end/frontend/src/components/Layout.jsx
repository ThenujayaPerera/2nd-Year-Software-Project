import Navbar from './Navbar';
import Footer from './Footer';
import SupportBot from './SupportBot';
import ComparisonFloatingButton from './ComparisonFloatingButton';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ComparisonFloatingButton />
      <SupportBot />
    </div>
  );
}
