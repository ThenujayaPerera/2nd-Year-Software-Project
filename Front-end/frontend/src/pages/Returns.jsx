import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

export default function Returns() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-darkText py-12 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto bg-white dark:bg-darkCard rounded-3xl shadow-lg border border-slate-100 dark:border-darkBorder p-12 text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-darkText mb-4">Returns & Refunds</h1>
          <p className="text-slate-600 dark:text-darkMuted mb-6">You can create a returns request here or review our returns policy.</p>
          <Link to="/contact" className="btn-primary inline-flex items-center justify-center font-bold py-3 px-8 rounded-xl shadow-md">
            Contact Support
          </Link>
        </div>
      </div>
    </Layout>
  );
}
