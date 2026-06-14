import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { useAuthStore } from '../store';
import { Mail, Lock, Eye, EyeOff, Smartphone, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication
      const userData = {
        id: 1,
        name: email.split('@')[0],
        email,
        role: 'user',
      };

      login(userData);
      localStorage.setItem('token', 'mock-token-' + Date.now());

      setAlert({ type: 'success', message: 'Welcome back! Redirecting...' });

      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (error) {
      setAlert({ type: 'error', message: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[700px] flex items-center justify-center py-16 px-6 bg-slate-50">
        <div className="w-full max-w-5xl bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden grid md:grid-cols-2">
          {/* Visual Brand Side */}
          <div className="hidden md:flex flex-col justify-between p-16 bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative z-10">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter">
                  NV<span className="text-blue-200">SHOP</span>
                </span>
              </Link>
            </div>
            
            <div className="relative z-10 my-auto py-12">
              <h2 className="text-4xl font-black mb-6 leading-tight">Access the Elite Tech Circle</h2>
              <p className="text-slate-200 leading-relaxed text-sm max-w-sm">
                Unlock exclusive member benefits, view order history, and enjoy curated collections designed for tech perfection.
              </p>
            </div>

            <div className="relative z-10 text-xs text-slate-300 font-semibold uppercase tracking-wider">
              © NV-SHOP Accessories
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-sm text-slate-500 font-medium">Log in to manage your orders and profile.</p>
            </div>

            {alert && (
              <div className="mb-6">
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-premium pl-12"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium pl-12 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-350 text-blue-600 focus:ring-blue-500/20" />
                  <span className="text-slate-650">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:hover:shadow-none"
              >
                <LogIn className="w-5 h-5" /> {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center text-sm font-semibold text-slate-650">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 transition-colors font-bold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}