import Navbar from './Navbar';
import Footer from './Footer';
import SupportBot from './SupportBot';
import ComparisonFloatingButton from './ComparisonFloatingButton';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
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
