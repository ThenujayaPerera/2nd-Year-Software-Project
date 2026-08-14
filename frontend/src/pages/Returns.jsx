import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

export default function Returns() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Returns & Refunds</h1>
          <p className="text-slate-600 mb-6">You can create a returns request here or review our returns policy.</p>
          <Link to="/contact" className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg">
            Contact Support
          </Link>
        </div>
      </div>
    </Layout>
  );
}
