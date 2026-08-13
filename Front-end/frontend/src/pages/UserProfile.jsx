import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, Clock, CheckCircle, AlertCircle, Calendar, Shield, 
  Download, MessageSquare, ChevronDown, User, MapPin, Phone, Mail, 
  ShoppingBag, LogOut, ArrowRight, ShieldCheck, Truck, Store, ExternalLink,
  Edit2, X, Check, Home as HomeIcon
} from 'lucide-react';
import { useAuthStore } from '../store';
import Layout from '../components/Layout';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [liveOrders, setLiveOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Edit Profile / Address Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Always declare hooks at the top level
  useEffect(() => {
    if (user?.email) {
      setLoadingOrders(true);
      fetch(`http://localhost:8080/api/orders/my-orders?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setLiveOrders(data);
        })
        .catch((err) => console.warn('Could not fetch live orders:', err))
        .finally(() => setLoadingOrders(false));
    }
  }, [user?.email]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || (liveOrders.length > 0 && liveOrders[0]?.address ? liveOrders[0].address : ''),
      });
    }
  }, [user, liveOrders]);

  const handleDemoUser = () => {
    const demoUser = {
      id: 1,
      name: 'Kulashi Himasha',
      email: 'khimasha16@gmail.com',
      phone: '+94 76 227 7566',
      address: 'No. 45, Temple Road, Galle, Sri Lanka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      role: 'customer',
    };
    setUser(demoUser);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveMessage('');

    try {
      const res = await fetch('http://localhost:8080/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: editForm.name,
          phone: editForm.phone,
          address: editForm.address,
        }),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setUser({ ...user, ...updatedData, address: editForm.address });
        setSaveMessage('Profile address updated successfully!');
        setTimeout(() => {
          setIsEditModalOpen(false);
          setSaveMessage('');
        }, 1200);
      } else {
        // Fallback local update
        setUser({ ...user, name: editForm.name, phone: editForm.phone, address: editForm.address });
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.warn('Could not update backend profile:', err);
      setUser({ ...user, name: editForm.name, phone: editForm.phone, address: editForm.address });
      setIsEditModalOpen(false);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-8rem)] bg-slate-50 py-16 px-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center border border-slate-100">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Customer Profile</h1>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Sign in to view your personal delivery address, orders, and authentic brand warranty certificates.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
              >
                Sign In to Your Account <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleDemoUser}
                className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Instant Preview with Demo Customer
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Display user's personal address or latest order shipping address
  const userDisplayAddress = user?.address || (liveOrders.length > 0 && liveOrders[0]?.address ? liveOrders[0].address : null);

  // Warranty data mockup for customer gadgets
  const warrantyItems = [
    {
      id: 'W-901',
      productName: 'Anker 737 Power Bank (PowerCore 24K 140W)',
      brand: 'Anker',
      serialNumber: 'ANK-24K-881920',
      purchaseDate: '2026-07-15',
      warrantyPeriod: '18 Months Official Warranty',
      status: 'Active',
      daysRemaining: 512,
    },
    {
      id: 'W-902',
      productName: 'UGREEN Nexode 100W 4-Port GaN Fast Charger',
      brand: 'UGREEN',
      serialNumber: 'UGR-100W-440219',
      purchaseDate: '2026-08-01',
      warrantyPeriod: '1 Year Warranty',
      status: 'Active',
      daysRemaining: 354,
    },
  ];

  return (
    <Layout>
      <div className="bg-slate-50/60 min-h-screen py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Customer Account</span>
          </div>

          {/* User Profile Card Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 capitalize">
                    {user?.name || 'Valued Customer'}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Verified Customer
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-blue-600" /> {user?.email}
                  </span>
                  
                  {user?.phone && (
                    <span className="flex items-center gap-1.5 font-medium font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> {user?.phone}
                    </span>
                  )}
                  
                  {/* Real User Personal Delivery Address */}
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    {userDisplayAddress ? (
                      <span className="text-slate-800 font-semibold">{userDisplayAddress}</span>
                    ) : (
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-blue-600 hover:underline font-bold text-[11px]"
                      >
                        + Add Delivery Address
                      </button>
                    )}
                  </span>

                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                to="/orders"
                className="flex-1 md:flex-initial px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-blue-100"
              >
                <Package className="w-4 h-4" /> Live Tracking
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-slate-200/80 pb-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                activeTab === 'orders'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Orders & Invoices ({liveOrders.length})
            </button>

            <button
              onClick={() => setActiveTab('warranties')}
              className={`pb-3 px-5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                activeTab === 'warranties'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Official Warranties ({warrantyItems.length})
            </button>

            <button
              onClick={() => setActiveTab('showroom')}
              className={`pb-3 px-5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                activeTab === 'showroom'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4" /> Showroom Pickup & Support
            </button>
          </div>

          {/* TAB 1: ORDERS & INVOICES */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs animate-pulse">
                  Loading your orders...
                </div>
              ) : liveOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-base mb-1">No Orders Placed Yet</h3>
                  <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">
                    When you order original Anker, UGREEN or Baseus accessories, your receipt and live delivery tracking will appear here.
                  </p>
                  <Link
                    to="/products"
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm"
                  >
                    Start Shopping <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                liveOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
                          Order Reference
                        </span>
                        <h4 className="font-black text-slate-900 text-base">{ord.orderNumber || `#NV-${ord.id}`}</h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.status === 'SHIPPED'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {ord.status || 'PROCESSING'}
                        </span>
                        <Link
                          to="/orders"
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          View Status <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Order Meta */}
                    <div className="grid sm:grid-cols-3 gap-4 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block font-medium">Payment Method:</span>
                        <span className="font-bold text-slate-800">{ord.paymentMethod || 'Cash on Delivery'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Delivery Address:</span>
                        <span className="font-bold text-slate-800 truncate block">{ord.shippingAddress || ord.address || userDisplayAddress || 'Showroom Pickup'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Total Amount:</span>
                        <span className="font-black text-slate-900 text-sm font-sans">
                          Rs. {ord.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: OFFICIAL WARRANTIES */}
          {activeTab === 'warranties' && (
            <div className="space-y-4">
              {warrantyItems.map((w) => (
                <div key={w.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {w.brand} Official
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {w.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{w.productName}</h4>
                    <p className="text-xs text-slate-400 font-mono">Serial: {w.serialNumber} • Claimable at NVSHOP Ambalangoda</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 block">{w.warrantyPeriod}</span>
                    <span className="text-[11px] text-emerald-600 font-bold">{w.daysRemaining} Days Remaining</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SHOWROOM & SUPPORT */}
          {activeTab === 'showroom' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1">Ambalangoda Showroom Direct Support</h3>
                <p className="text-xs text-slate-500">
                  Pick up your online orders in person or visit for device testing and warranty claims.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                  <p className="font-bold text-slate-900 flex items-center gap-2">
                    <Store className="w-4 h-4 text-blue-600" /> Showroom Address:
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    185/1/2B New Road, Ambalangoda 80300, Sri Lanka
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">Open 7 days a week: 10:00 AM – 8:00 PM</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                  <p className="font-bold text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" /> Hotlines & WhatsApp:
                  </p>
                  <p className="text-slate-600 font-bold">+94 76 989 0079 / +94 77 747 0186</p>
                  <p className="text-slate-600">Email: nvshopamba@gmail.com</p>
                </div>
              </div>

              <a
                href="https://wa.me/94769890079?text=Hello%20NVSHOP,%20I%20have%20an%20inquiry%20regarding%20my%20customer%20profile."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp Support
              </a>
            </div>
          )}

        </div>
      </div>

      {/* EDIT PROFILE / DELIVERY ADDRESS MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <HomeIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Edit Delivery Address</h3>
                  <p className="text-[11px] text-slate-400">Update your personal shipping details</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4" /> {saveMessage}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Kulashi Himasha"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+94 7X XXX XXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Personal Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="e.g. No. 45, Temple Road, Galle / Colombo 03, Sri Lanka"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50 leading-relaxed font-medium"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This address will be used for your Islandwide courier deliveries.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  {savingProfile ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
