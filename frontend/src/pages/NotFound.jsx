import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-10rem)] bg-gradient-to-br from-slate-50 to-slate-100 py-8 sm:py-16 px-3 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg p-6 sm:p-12 text-center border border-slate-100">
          <span className="text-4xl sm:text-6xl font-black text-blue-600 font-mono block mb-2">404</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 sm:mb-8 max-w-xs mx-auto">The page you requested could not be found or has moved.</p>
          <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
