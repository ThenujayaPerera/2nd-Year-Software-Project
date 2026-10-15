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
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-8 sm:py-16 px-3 sm:px-6 bg-slate-50">
        <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-lg p-5 sm:p-10">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 text-slate-700 font-semibold text-xs sm:text-sm">
              <ArrowLeft className="w-4 h-4" />
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Back to Sign In
              </Link>
            </div>
            <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-black text-slate-900">Forgot Password</h1>
            <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-slate-600">Enter your email and we will send you instructions to reset your password.</p>
          </div>

          {status && (
            <div className="mb-5 sm:mb-6">
              <Alert type={status.type} message={status.message} onClose={() => setStatus(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 text-xs sm:text-sm border border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-bold transition-all text-xs sm:text-sm shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" /> Send Reset Link
            </button>
          </form>

          <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-slate-500 text-center">
            Remembered your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
