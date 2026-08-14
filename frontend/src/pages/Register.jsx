import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Check, ArrowRight, 
  ShieldCheck, RefreshCw, Smartphone, Bell, MessageSquare, ExternalLink, Inbox
} from 'lucide-react';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('both'); // 'email', 'phone', or 'both'
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: 'Ambalangoda',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email address is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms & Conditions';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authAPI.register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      setOtpSent(true);
      setResendTimer(60);
      setCanResend(false);
      setOtpError('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Email might already exist.';
      setErrors({ server: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-focus next input box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter all 6 digits of the verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOtp({ email: formData.email, otp: enteredOtp });
      const { token, user: userData } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      login(userData || { 
        name: `${formData.firstName} ${formData.lastName}`, 
        email: formData.email, 
        phone: formData.phone,
        isEmailVerified: true 
      });
      navigate('/');
    } catch (error) {
      setOtpError(error.response?.data?.message || 'Invalid or expired verification code. Please check your email inbox or phone.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await fetch('http://localhost:8080/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, phone: formData.phone }),
      });
      setResendTimer(60);
      setCanResend(false);
      setOtpError('');
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err) {
      console.warn('Resend OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="grid md:grid-cols-2">
            
            {/* Left Column: Brand Hero & Benefits */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)]" />
              
              <div className="relative z-10">
                <Link to="/" className="inline-block bg-white/95 px-3 py-1.5 rounded-xl border border-white/20 shadow-sm mb-8">
                  <span className="font-black text-blue-600 text-sm tracking-wider">NVSHOP.LK</span>
                </Link>

                <h2 className="text-3xl font-black leading-tight mb-4">
                  {otpSent ? 'Email & Phone Verification' : 'Join NVSHOP.LK Customer Rewards'}
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mb-6">
                  {otpSent
                    ? 'Enter the 6-digit verification code sent to your email inbox and phone number to activate your account.'
                    : 'Create your account to unlock instant express checkout, email invoices, live delivery tracking, and genuine brand warranties in Sri Lanka.'}
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded-full bg-blue-500/30 text-white"><Check className="w-3.5 h-3.5 stroke-[3]" /></div>
                    <span>Instant Email OTP & SMS Verification</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded-full bg-blue-500/30 text-white"><Check className="w-3.5 h-3.5 stroke-[3]" /></div>
                    <span>Automated HTML Invoices sent to your Email</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded-full bg-blue-500/30 text-white"><Check className="w-3.5 h-3.5 stroke-[3]" /></div>
                    <span>100% Genuine Anker, UGREEN & Baseus Products</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-8 border-t border-white/10 text-[11px] text-blue-200">
                📍 185/1/2B New Road, Ambalangoda • Hotline: +94 76 989 0079
              </div>
            </div>

            {/* Right Column: Dynamic Form (Registration ➔ 6-Digit Email & SMS OTP Stage) */}
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              
              {/* STAGE 2: 6-DIGIT EMAIL & SMS OTP VERIFICATION SCREEN */}
              {otpSent ? (
                <div className="space-y-6 animate-in fade-in zoom-in-95">
                  
                  {/* Email & SMS Dispatch Banner */}
                  <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Verification Code Sent via Email & SMS</span>
                    </div>
                    
                    <div className="text-[11px] text-slate-600 space-y-1 pl-6">
                      <p>📧 Email: <strong className="text-slate-900 font-mono">{formData.email}</strong></p>
                      {formData.phone && (
                        <p>📱 Mobile: <strong className="text-slate-900 font-mono">+94 {formData.phone}</strong></p>
                      )}
                    </div>

                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 pl-6 hover:underline"
                    >
                      <Inbox className="w-3.5 h-3.5" /> Open Gmail Inbox <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-black text-slate-900">Enter Verification Code</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the 6-digit code received on your Email or Phone SMS
                    </p>
                  </div>

                  {otpError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold text-center">
                      {otpError}
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    {/* 6 Individual Digit Boxes */}
                    <div className="flex justify-center gap-2 sm:gap-2.5">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 bg-slate-50 text-slate-900 transition-all font-mono"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpDigits.join('').length !== 6}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      {loading ? 'Verifying Code...' : 'Verify Email & Activate Account'}
                    </button>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Didn't receive email code?</span>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                        </button>
                      ) : (
                        <span className="font-bold text-slate-400">Resend in {resendTimer}s</span>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                /* STAGE 1: SIGNUP REGISTRATION FORM */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Create Account</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Register to receive an Email & SMS verification code
                    </p>
                  </div>

                  {errors.server && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold">
                      {errors.server}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Mayantha"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50"
                      />
                      {errors.firstName && <p className="text-[10px] text-red-600 mt-0.5">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Nawarathna"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50"
                      />
                      {errors.lastName && <p className="text-[10px] text-red-600 mt-0.5">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email Input (Primary Verification Method) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center justify-between">
                      <span>Email Address (For Verification Code)</span>
                      <span className="text-[10px] text-blue-600 font-semibold">Required for OTP</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50"
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-600 mt-0.5">{errors.email}</p>}
                  </div>

                  {/* Phone Number Field with Sri Lanka +94 Country Prefix */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center justify-between">
                      <span>Mobile Phone Number (Optional SMS OTP)</span>
                      <span className="text-[10px] text-slate-400">Sri Lanka</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-600 pointer-events-none">
                        <span>🇱🇰</span>
                        <span>+94</span>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="76 989 0079"
                        className="w-full pl-16 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50 font-mono"
                      />
                    </div>
                    {errors.phone && <p className="text-[10px] text-red-600 mt-0.5">{errors.phone}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50"
                      />
                      {errors.password && <p className="text-[10px] text-red-600 mt-0.5">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Confirm Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50"
                      />
                      {errors.confirmPassword && <p className="text-[10px] text-red-600 mt-0.5">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>I agree to the <Link to="/terms-conditions" className="text-blue-600 underline">Terms</Link> & <Link to="/privacy-policy" className="text-blue-600 underline">Privacy</Link></span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? 'Sending Email Verification Code...' : 'Register & Send Verification Code'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-slate-500 pt-2">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-blue-600 hover:underline">
                      Sign In here
                    </Link>
                  </p>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
