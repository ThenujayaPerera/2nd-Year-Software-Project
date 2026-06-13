import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { useAuthStore } from '../store';

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

      setAlert({ type: 'success', message: 'Login successful! Redirecting...' });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setAlert({ type: 'error', message: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[600px] flex items-center justify-center bg-gray-50 py-8 px-4">
        <div className="w-full max-w-md">
          <div className="card">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">📱</div>
              <h1 className="text-3xl font-bold mb-2">NV-SHOP</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded accent-blue-600" />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 border-t"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-2">
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <span>🔷</span> Continue with Google
              </button>
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <span>🔵</span> Continue with Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
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