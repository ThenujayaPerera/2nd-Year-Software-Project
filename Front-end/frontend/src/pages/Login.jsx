import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      login(userData || { id: 1, name: email.split('@')[0], email, role: 'user' });
      if (token) {
        localStorage.setItem('token', token);
      }

      setAlert({ type: 'success', message: 'Logged in successfully! Redirecting...' });

      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Invalid email or password.';
      setAlert({ type: 'error', message: errorMsg });
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
                <img 
                  src="/logo.png" 
                  alt="NVSHOP.LK" 
                  className="h-12 w-auto object-contain bg-white/95 p-2 rounded-xl border border-white/20 shadow-sm" 
                />
              </Link>
            </div>
            
            <div className="relative z-10 my-auto py-12">
              <h2 className="text-4xl font-black mb-6 leading-tight">Welcome Back to NVSHOP.LK</h2>
              <p className="text-slate-200 leading-relaxed text-sm max-w-sm">
                Sign in to manage your orders, track deliveries, and access exclusive member deals on authentic tech accessories.
              </p>
            </div>

            <div className="relative z-10 text-xs text-slate-300 font-semibold uppercase tracking-wider">
              © NV-SHOP Accessories
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 mb-2">Account Login</h1>
              <p className="text-sm text-slate-500 font-medium">Enter your email and password to log in.</p>
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

            <form onSubmit={handleLogin} className="space-y-5">
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
                    autoComplete="username"
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
                    autoComplete="current-password"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:hover:shadow-none"
              >
                <LogIn className="w-5 h-5" /> {loading ? 'Logging in...' : 'Log In'}
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