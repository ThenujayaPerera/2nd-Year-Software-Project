import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

export default function Returns() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-10rem)] bg-gradient-to-br from-slate-50 to-slate-100 py-8 sm:py-16 px-3 sm:px-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg p-6 sm:p-12 text-center border border-slate-100">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 sm:mb-4">Returns & Refunds</h1>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 sm:mb-8 max-w-sm mx-auto leading-relaxed">You can create a returns request here or review our returns policy. We offer an easy 7-day return policy for unopened items or manufacturing defects.</p>
          <Link to="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all">
            Contact Support
          </Link>
        </div>
      </div>
    </Layout>
  );
}
