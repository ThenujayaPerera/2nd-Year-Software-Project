import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, Clock, CheckCircle, AlertCircle, Calendar, Shield, 
  Download, MessageSquare, ChevronDown, User, MapPin, Phone, Mail, 
  ShoppingBag, LogOut, ArrowRight, ShieldCheck, Truck, Store, ExternalLink,
  Edit2, X, Check, Home as HomeIcon, Receipt, RefreshCw, Printer
} from 'lucide-react';
import { useAuthStore, useCartStore } from '../store';
import Layout from '../components/Layout';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const { addToCart } = useCartStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [liveOrders, setLiveOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Edit Profile / Address Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Default mock orders fallback if user has no orders yet in DB
  const defaultUserOrders = [
    {
      id: 894210,
      orderNumber: 'NV-894210',
      createdAt: '2026-08-10T14:30:00',
      status: 'DELIVERED',
      paymentMethod: 'CARD',
      paymentStatus: 'SUCCESS',
      totalAmount: 23000,
      shippingAddress: user?.address || '185/1/2B New Road, Ambalangoda, Sri Lanka',
      trackingNumber: 'DOM-LK-8839102',
      courier: 'Domex Express Sri Lanka',
      items: [
        {
          id: 1,
          productId: 1,
          productName: 'UGREEN Nexode 100W 4-Port GaN Fast Charger',
          productImage: 'https://api.nvshop.lk/api/public/file/69c61b2e3cafeb520d7bbb34/download (14).jfif',
          price: 16500,
          quantity: 1,
          subtotal: 16500,
          warranty: '18 Months Warranty',
        },
        {
          id: 2,
          productId: 2,
          productName: 'Apple Original 20W USB-C Power Adapter',
          productImage: 'https://api.nvshop.lk/api/public/file/69a966d647ef868f0adc57fe/4abd5f98ce6569be4b94056c4e52a064.jpg_960x960q80.jpg_.webp',
          price: 6500,
          quantity: 1,
          subtotal: 6500,
          warranty: '1 Year Warranty',
        },
      ],
    },
    {
      id: 941825,
      orderNumber: 'NV-941825',
      createdAt: '2026-08-12T09:15:00',
      status: 'SHIPPED',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      totalAmount: 26500,
      shippingAddress: user?.address || '185/1/2B New Road, Ambalangoda, Sri Lanka',
      trackingNumber: 'PRN-LK-9941028',
      courier: 'Pronto Delivery Express',
      items: [
        {
          id: 3,
          productId: 3,
          productName: 'Anker Soundcore Liberty 5 ANC Earbuds',
          productImage: 'https://api.nvshop.lk/api/public/file/69a54a7b47ef868f0adc4ada/download (1).jfif',
          price: 26500,
          quantity: 1,
          subtotal: 26500,
          warranty: '18 Months Official Warranty',
        },
      ],
    },
  ];

  // Fetch live orders from backend
  useEffect(() => {
    if (user?.email) {
      setLoadingOrders(true);
      fetch(`http://localhost:8080/api/orders/my-orders?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setLiveOrders(data);
          } else {
            setLiveOrders(defaultUserOrders);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch live orders, using default history:', err);
          setLiveOrders(defaultUserOrders);
        })
        .finally(() => setLoadingOrders(false));
    } else {
      setLiveOrders(defaultUserOrders);
    }
  }, [user?.email, user?.address]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || (liveOrders.length > 0 && liveOrders[0]?.shippingAddress ? liveOrders[0].shippingAddress : ''),
      });
    }
  }, [user, liveOrders]);

  const handleDemoUser = () => {
    const demoUser = {
      id: 1,
      name: 'Kulashi Himasha',
      email: 'khimasha16@gmail.com',
      phone: '+94 76 227 7566',
      address: '185/1/2B New Road, Ambalangoda, Sri Lanka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      role: 'customer',
    };
    setUser(demoUser);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReorder = (item) => {
    addToCart({
      id: item.productId || item.id,
      name: item.productName,
      price: item.price,
      image: item.productImage,
    });
    navigate('/cart');
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
        setSaveMessage('Profile and address updated successfully!');
        setTimeout(() => {
          setIsEditModalOpen(false);
          setSaveMessage('');
        }, 1200);
      } else {
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
  const userDisplayAddress = user?.address || (liveOrders.length > 0 && liveOrders[0]?.shippingAddress ? liveOrders[0].shippingAddress : null);

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
      <div className="bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-8 px-4 sm:px-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">Customer Account</span>
          </div>

          {/* User Profile Card Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors duration-300">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white capitalize">
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
            <div className="space-y-6">
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
                liveOrders.map((ord) => {
                  const isDelivered = ord.status === 'DELIVERED';
                  const isShipped = ord.status === 'SHIPPED';
                  
                  return (
                    <div
                      key={ord.id || ord.orderNumber}
                      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all space-y-6"
                    >
                      {/* Top Bar: Order ID, Date, Status */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                              ORDER NO.
                            </span>
                            <span className="font-black text-slate-900 text-base font-mono">
                              {ord.orderNumber || `#NV-${ord.id}`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Placed on {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border ${
                              isDelivered
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isShipped
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {ord.status || 'PROCESSING'}
                          </span>

                          <button
                            onClick={() => setSelectedInvoice(ord)}
                            className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 transition-all flex items-center gap-1.5"
                          >
                            <Receipt className="w-3.5 h-3.5 text-blue-600" /> View Invoice
                          </button>
                        </div>
                      </div>

                      {/* Delivery Stepper */}
                      <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-3">
                          <span className="flex items-center gap-1.5 text-slate-900">
                            <Truck className="w-4 h-4 text-blue-600" />
                            {isDelivered ? 'Delivered to Destination' : isShipped ? 'Package On The Way (In Transit)' : 'Order Processing & Quality Check'}
                          </span>
                          {ord.courier && (
                            <span className="text-[11px] text-slate-500 font-mono">
                              Courier: {ord.courier}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-2 relative">
                          <div className="text-center">
                            <div className="w-6 h-6 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold mb-1 shadow-xs">
                              ✓
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block">Confirmed</span>
                          </div>

                          <div className="text-center">
                            <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold mb-1 shadow-xs ${
                              isShipped || isDelivered ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white animate-pulse'
                            }`}>
                              {isShipped || isDelivered ? '✓' : '2'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block">Packed</span>
                          </div>

                          <div className="text-center">
                            <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold mb-1 shadow-xs ${
                              isDelivered ? 'bg-emerald-600 text-white' : isShipped ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isDelivered ? '✓' : '3'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block">In Transit</span>
                          </div>

                          <div className="text-center">
                            <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold mb-1 shadow-xs ${
                              isDelivered ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isDelivered ? '✓' : '4'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 block">Delivered</span>
                          </div>
                        </div>
                      </div>

                      {/* Ordered Products List */}
                      <div className="divide-y divide-slate-100">
                        {(ord.items || []).map((item, idx) => (
                          <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={item.productImage || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=120'}
                                alt={item.productName}
                                className="w-14 h-14 rounded-xl object-contain bg-slate-50 p-1.5 border border-slate-100 shrink-0"
                              />
                              <div>
                                <h5 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                                  {item.productName}
                                </h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[11px] text-slate-500">Qty: <b>{item.quantity}</b></span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-[11px] font-bold text-blue-600 font-mono">
                                    Rs. {(item.price || 0).toLocaleString()}
                                  </span>
                                  {item.warranty && (
                                    <>
                                      <span className="text-slate-300">•</span>
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                        {item.warranty}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleReorder(item)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded-xl transition-all flex items-center gap-1 shrink-0"
                            >
                              <RefreshCw className="w-3 h-3" /> Buy Again
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer: Payment & Delivery Summary */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="text-slate-500">
                            <span className="font-bold text-slate-700">Delivery Address:</span>{' '}
                            {ord.shippingAddress || userDisplayAddress}
                          </p>
                          <p className="text-slate-500">
                            <span className="font-bold text-slate-700">Payment:</span>{' '}
                            {ord.paymentMethod === 'CARD' ? 'Debit/Credit Card (Paid Online)' : 'Cash on Delivery (COD)'}
                          </p>
                        </div>

                        <div className="text-right sm:self-center shrink-0">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                            Total Paid
                          </span>
                          <span className="text-lg font-black text-slate-900 font-sans">
                            Rs. {(ord.totalAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })
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

      {/* VIEW / PRINT INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-blue-600 font-black text-lg tracking-tight">NVSHOP.LK</span>
                <p className="text-[11px] text-slate-400 font-mono">Invoice #{selectedInvoice.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-slate-400 block font-medium">Billed To:</span>
                  <span className="font-bold text-slate-900 block">{user?.name}</span>
                  <span className="text-slate-600 block">{user?.email}</span>
                  <span className="text-slate-600 block">{selectedInvoice.shippingAddress || userDisplayAddress}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-medium">Date & Status:</span>
                  <span className="font-bold text-slate-900 block">
                    {new Date(selectedInvoice.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {(selectedInvoice.items || []).map((it, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{it.productName}</p>
                      <p className="text-[10px] text-slate-400">Qty: {it.quantity}</p>
                    </div>
                    <p className="font-black text-slate-900 font-mono">
                      Rs. {((it.price || 0) * (it.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700">Total Amount:</span>
                <span className="font-black text-blue-600 text-base font-sans">
                  Rs. {(selectedInvoice.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                  placeholder="e.g. 185/1/2B New Road, Ambalangoda, Sri Lanka"
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
