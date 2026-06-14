import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Check } from 'lucide-react';
import { useAuthStore } from '../store';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    if (formData.phone.length < 10) newErrors.phone = 'Valid phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms and conditions';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSuccess(true);
    
    // Simulate registration and auto-login
    setTimeout(() => {
      login({
        id: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: 'user',
      });
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Form */}
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  Create Account
                </h1>
                <p className="text-slate-600">Join NV-SHOP for exclusive deals and rewards</p>
              </div>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">Registration successful! Redirecting...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                          errors.firstName 
                            ? 'border-red-300 bg-red-50 focus:border-red-500' 
                            : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                    </div>
                    {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                          errors.lastName 
                            ? 'border-red-300 bg-red-50 focus:border-red-500' 
                            : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                        }`}
                      />
                    </div>
                    {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                        errors.email 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 71 234 5678"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                        errors.phone 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street, City, Country"
                      rows="2"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none resize-none ${
                        errors.address 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                        errors.password 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                        errors.confirmPassword 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-slate-200 bg-slate-50 focus:border-primary focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label className="text-sm text-slate-600">
                    I agree to the <span className="text-primary font-semibold">Terms and Conditions</span> and <span className="text-primary font-semibold">Privacy Policy</span>
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-xs text-red-600">{errors.agreeTerms}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={success}
                  className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:to-primary disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {success ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-slate-600 text-sm mt-6">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
              </p>
            </div>

            {/* Right Side - Benefits */}
            <div className="hidden md:flex bg-gradient-to-br from-primary/10 to-primary/5 p-12 flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Exclusive Deals</h3>
                  <p className="text-slate-600">Get access to member-only promotions and early access to new products</p>
                </div>

                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Track Orders</h3>
                  <p className="text-slate-600">Monitor your purchases, warranties, and delivery status in one place</p>
                </div>

                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Rewards Program</h3>
                  <p className="text-slate-600">Earn points on every purchase and redeem them for discounts</p>
                </div>

                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">24/7 Support</h3>
                  <p className="text-slate-600">Our support team is always here to help with any questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
