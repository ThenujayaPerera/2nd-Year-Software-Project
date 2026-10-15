import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Eye, EyeOff, ShieldAlert, Key, User } from 'lucide-react';
import Admin from './pages/Admin';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Portal Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('nvshop_admin_session');
    } catch (e) {
      console.warn('Could not remove admin session:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-xs text-slate-500 mb-4">
              An unexpected error occurred in the Admin Portal interface.
            </p>
            {this.state.error && (
              <pre className="text-[11px] bg-slate-100 text-rose-700 p-3 rounded-xl overflow-x-auto text-left mb-6 font-mono whitespace-pre-wrap">
                {String(this.state.error?.message || this.state.error)}
              </pre>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                Reset & Sign Out
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const getApiHost = () => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return window.location.hostname;
  }
  return '127.0.0.1';
};

const AUTH_BASE = `http://${getApiHost()}:8080/api/admin-auth`;

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      // First try configured host
      const res = await axios.post(`${AUTH_BASE}/login`, { 
        email: trimmedEmail, 
        password: trimmedPassword 
      });
      if (res.data) {
        onLogin(res.data);
      }
    } catch (err) {
      console.warn('Primary login attempt failed, trying fallback 127.0.0.1...', err);
      try {
        const fallbackRes = await axios.post('http://127.0.0.1:8080/api/admin-auth/login', { 
          email: trimmedEmail, 
          password: trimmedPassword 
        });
        if (fallbackRes.data) {
          onLogin(fallbackRes.data);
          return;
        }
      } catch (fallbackErr) {
        console.error('Login error:', fallbackErr);
        const serverMsg = fallbackErr.response?.data?.message || err.response?.data?.message;
        if (serverMsg) {
          setError(serverMsg);
        } else if (fallbackErr.code === 'ERR_NETWORK' || err.code === 'ERR_NETWORK') {
          setError('Cannot connect to backend server at http://127.0.0.1:8080. Please ensure the backend is running.');
        } else {
          setError('Login failed. Please verify your credentials and try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="NVSHOP.LK" 
              className="h-12 w-auto object-contain" 
            />
          </div>
          <h2 className="text-2xl font-black text-center text-slate-900 mb-1">Admin Portal</h2>
          <p className="text-slate-500 text-center text-xs mb-6">Sign in to manage inventory, orders, and customer feedback</p>
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs font-semibold mb-6 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Fill Credentials Bar */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Quick Sign In (Default Accounts)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('superadmin@example.com', 'admin123')}
                className="flex-1 py-1.5 px-2 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-[11px] font-bold text-slate-700 hover:text-blue-600 transition-all shadow-xs cursor-pointer"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@nvshop.lk', 'admin123')}
                className="flex-1 py-1.5 px-2 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-[11px] font-bold text-slate-700 hover:text-blue-600 transition-all shadow-xs cursor-pointer"
              >
                Operations Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all bg-slate-50 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@example.com or admin"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all bg-slate-50 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white text-xs font-bold py-3 rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Management Console'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-6">
            Default Password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('nvshop_admin_session');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    try {
      localStorage.setItem('nvshop_admin_session', JSON.stringify(adminData));
    } catch (e) {
      console.warn('Could not cache admin session in localStorage:', e);
    }
  };

  const handleLogout = () => {
    setAdmin(null);
    try {
      localStorage.removeItem('nvshop_admin_session');
    } catch (e) {
      console.warn('Could not clear admin session from localStorage:', e);
    }
  };

  return (
    <ErrorBoundary>
      {!admin ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Admin admin={admin} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      )}
    </ErrorBoundary>
  );
}
