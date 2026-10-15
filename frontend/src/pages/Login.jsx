import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';
import { Mail, Lock, Eye, EyeOff, LogIn, KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'forgot-request' | 'forgot-reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      const userToStore = {
        ...(userData || {}),
        name: userData?.name || email.split('@')[0],
        email: email,
        role: 'user'
      };

      login(userToStore);
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

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setAlert({ type: 'error', message: 'Please enter your registered email address.' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      await authAPI.requestForgotPasswordOtp({ email: email.trim() });
      setAlert({
        type: 'success',
        message: 'A 6-digit verification PIN has been sent to your email. Enter it below along with your new password.'
      });
      setMode('forgot-reset');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to dispatch reset PIN. Please check your email and try again.';
      setAlert({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!otp || otp.trim().length !== 6) {
      setAlert({ type: 'error', message: 'Please enter the 6-digit numeric PIN sent to your email.' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setAlert({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match. Please verify and re-type.' });
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPasswordWithOtp({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });

      const { token, user: userData } = response.data;

      const userToStore = {
        ...(userData || {}),
        name: userData?.name || email.split('@')[0],
        email: email,
        role: 'user'
      };

      // Bypass password, give access and save session immediately
      login(userToStore);
      if (token) {
        localStorage.setItem('token', token);
      }

      setAlert({
        type: 'success',
        message: 'Password reset successful! Logging you in automatically...'
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid or expired 6-digit PIN code. Please try again.';
      setAlert({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const resetFormState = () => {
    setAlert(null);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setPassword('');
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-8 sm:py-16 px-3 sm:px-6 bg-slate-50">
        <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-xl sm:shadow-2xl overflow-hidden grid md:grid-cols-2">
          {/* Visual Brand Side */}
          <div className="hidden md:flex flex-col justify-between p-12 lg:p-16 bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative">
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
              <h2 className="text-4xl font-black mb-6 leading-tight">
                {mode === 'login' ? 'Welcome Back to NVSHOP.LK' : 'Account Security & Password Reset'}
              </h2>
              <p className="text-slate-200 leading-relaxed text-sm max-w-sm">
                {mode === 'login'
                  ? 'Sign in to manage your orders, track deliveries, and access exclusive member deals on authentic tech accessories.'
                  : 'Verify your identity with an email verification PIN to restore full account access and set your new password.'}
              </p>
            </div>

            <div className="relative z-10 text-xs text-slate-300 font-semibold uppercase tracking-wider">
              NV-SHOP Accessories Sri Lanka
            </div>
          </div>

          {/* Form Side */}
          <div className="p-5 sm:p-8 md:p-14 lg:p-16 flex flex-col justify-center">
            {/* Header section based on mode */}
            {mode === 'login' && (
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 sm:mb-2">Account Login</h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Enter your email and password to log in.</p>
              </div>
            )}

            {mode === 'forgot-request' && (
              <div className="mb-6 sm:mb-8">
                <button
                  type="button"
                  onClick={() => {
                    resetFormState();
                    setMode('login');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-3 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 sm:mb-2">Forgot Password</h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Enter your registered email address and we will dispatch a 6-digit verification PIN to your inbox.
                </p>
              </div>
            )}

            {mode === 'forgot-reset' && (
              <div className="mb-6 sm:mb-8">
                <button
                  type="button"
                  onClick={() => {
                    resetFormState();
                    setMode('login');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-3 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 sm:mb-2">Set New Password</h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Enter the 6-digit PIN sent to <span className="font-bold text-slate-700">{email}</span> and specify your new password twice.
                </p>
              </div>
            )}

            {alert && (
              <div className="mb-6">
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </div>
            )}

            {/* FORM 1: NORMAL LOGIN */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
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

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        resetFormState();
                        setMode('forgot-request');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:hover:shadow-none"
                >
                  <LogIn className="w-5 h-5" /> {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
            )}

            {/* FORM 2: FORGOT PASSWORD - REQUEST 6-DIGIT PIN */}
            {mode === 'forgot-request' && (
              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Registered Email Address
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:hover:shadow-none"
                >
                  <KeyRound className="w-5 h-5" /> {loading ? 'Sending PIN Code...' : 'Send 6-Digit PIN to Email'}
                </button>
              </form>
            )}

            {/* FORM 3: FORGOT PASSWORD - VERIFY PIN & ENTER NEW PASSWORD TWICE */}
            {mode === 'forgot-reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* 6-Digit PIN input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      6-Digit Email Verification PIN
                    </label>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleRequestOtp}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Resend PIN
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="input-premium pl-12 font-mono tracking-widest text-lg font-bold placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
                      placeholder="123456"
                      autoComplete="one-time-code"
                      required
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-premium pl-12 pr-12"
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-premium pl-12 pr-12"
                      placeholder="Re-type new password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:hover:shadow-none mt-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> {loading ? 'Saving & Authenticating...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}

            {/* Bottom links */}
            <div className="mt-8 text-center text-sm font-semibold text-slate-650">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-700 transition-colors font-bold">
                    Sign up
                  </Link>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    resetFormState();
                    setMode('login');
                  }}
                  className="text-blue-600 hover:text-blue-700 transition-colors font-bold"
                >
                  Remember your password? Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}