import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import Layout from '../components/Layout';
import Alert from '../components/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: 'success', message: 'If this email is registered, a reset link has been sent.' });
    setEmail('');
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-slate-50">
        <div className="w-full max-w-xl bg-white rounded-[2rem] border border-slate-200 shadow-lg p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 text-slate-700 font-semibold">
              <ArrowLeft className="w-5 h-5" />
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Back to Sign In
              </Link>
            </div>
            <h1 className="mt-6 text-3xl font-black text-slate-900">Forgot Password</h1>
            <p className="mt-3 text-slate-600">Enter your email and we will send you instructions to reset your password.</p>
          </div>

          {status && (
            <div className="mb-6">
              <Alert type={status.type} message={status.message} onClose={() => setStatus(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all"
            >
              <Send className="w-5 h-5" /> Send Reset Link
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Remembered your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
