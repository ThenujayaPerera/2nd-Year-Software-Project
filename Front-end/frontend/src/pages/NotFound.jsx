import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-darkText py-12 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto bg-white dark:bg-darkCard rounded-3xl shadow-lg border border-slate-100 dark:border-darkBorder p-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-darkText mb-4">404 — Page Not Found</h1>
          <p className="text-slate-600 dark:text-darkMuted mb-6">The page you requested does not exist.</p>
          <Link to="/" className="btn-primary inline-flex items-center justify-center font-bold py-3 px-8 rounded-xl shadow-md">
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
