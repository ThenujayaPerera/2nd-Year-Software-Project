import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  TrendingUp, ArrowRight, Plus, Pencil, Trash2,
  RefreshCw, Download, Search, Filter, ShieldCheck, AlertTriangle, CreditCard, Check, X, Ban, UserCheck, UserPlus, Shield, LogOut, Activity, ShieldAlert, Star, Image as ImageIcon, Warehouse, Truck
} from 'lucide-react';
import AdminProductPreview from '../components/AdminProductPreview';
import CustomizeHomeTab from '../components/CustomizeHomeTab';
import StockManagementTab from '../components/StockManagementTab';
import SuppliersTab from '../components/SuppliersTab';

export default function Admin({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
    lowStockProducts: [],
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // New Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Power Banks',
    brand: 'Anker',
    stock: 15,
    warranty: '1 Year Warranty',
    returnPeriod: '7 Days',
    image: 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600',
    description: '',
    rating: 5.0,
    reviews: 1,
    isNew: true,
    discount: 0,
    descriptionImages: [],
    galleryImages: [],
  });

  // Add New Admin Modal State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminAlert, setAdminAlert] = useState(null);

  // Edit Product Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editAlert, setEditAlert] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '185/1/2B New Road, Ambalangoda, Sri Lanka',
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Sales Reports & Low Stock (FR2.6 & FR2.7)
      const repRes = await fetch('http://localhost:8080/api/admin/reports/sales');
      if (repRes.ok) {
        const rep = await repRes.json();
        setReportData(rep);
      }

      // 2. Fetch Orders (FR2.4)
      const ordRes = await fetch('http://localhost:8080/api/admin/orders');
      if (ordRes.ok) {
        const ords = await ordRes.json();
        setOrders(ords);
      }

      // 3. Fetch Products (FR2.2)
      const prodRes = await fetch('http://localhost:8080/api/products');
      if (prodRes.ok) {
        const prods = await prodRes.json();
        setProducts(prods);
      }

      // 4. Fetch Users (FR2.8)
      const userRes = await fetch('http://localhost:8080/api/admin/users');
      if (userRes.ok) {
        const usrs = await userRes.json();
        setUsersList(usrs);
      }

      // 5. Fetch Payment Transactions (FR3.3)
      const payRes = await fetch('http://localhost:8080/api/admin/payments');
      if (payRes.ok) {
        const pymts = await payRes.json();
        setPayments(pymts);
      }

      // 6. Fetch Admins
      const adminRes = await fetch('http://localhost:8080/api/admin/admins');
      if (adminRes.ok) {
        setAdminsList(await adminRes.json());
      }
    } catch (e) {
      console.warn('Admin API offline fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAdminRole = async (adminId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/admins/${adminId}/toggle-role`, { method: 'PUT' });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/admins/${adminId}`, { method: 'DELETE' });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to add this administrator account?')) return;
    setAdminSaving(true);
    setAdminAlert(null);
    try {
      const res = await fetch('http://localhost:8080/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAdmin,
          role: 'ADMIN',
        }),
      });
      if (res.ok) {
        setShowAddAdminModal(false);
        setNewAdmin({
          name: '',
          email: '',
          phone: '',
          password: '',
          address: '185/1/2B New Road, Ambalangoda, Sri Lanka',
        });
        fetchAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setAdminAlert(data.message || 'Failed to create administrator.');
      }
    } catch (err) {
      console.error(err);
      setAdminAlert('Server connection error. Please try again.');
    } finally {
      setAdminSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleHighlight = async (productId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${productId}/highlight`, {
        method: 'PUT',
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || 'Others',
      brand: product.brand || '',
      stock: product.stock ?? 0,
      warranty: product.warranty || '1 Year Warranty',
      returnPeriod: product.returnPeriod || '7 Days',
      image: product.image || '',
      description: product.description || '',
      discount: product.discount || 0,
      rating: product.rating || 5.0,
      reviews: product.reviews || 0,
      isNew: product.isNew || false,
      descriptionImages: product.descriptionImages || [],
      galleryImages: product.galleryImages || [],
    });
    setEditAlert(null);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to save these changes?')) return;
    setEditSaving(true);
    setEditAlert(null);
    try {
      const res = await fetch(`http://localhost:8080/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingProduct,
          price: parseFloat(editingProduct.price),
          originalPrice: parseFloat(editingProduct.originalPrice || editingProduct.price),
          stock: parseInt(editingProduct.stock),
          discount: parseInt(editingProduct.discount || 0),
          rating: parseFloat(editingProduct.rating || 5.0),
          reviews: parseInt(editingProduct.reviews || 0),
          isNew: Boolean(editingProduct.isNew),
          descriptionImages: editingProduct.descriptionImages.filter(img => img.trim() !== ''),
          galleryImages: editingProduct.galleryImages.filter(img => img.trim() !== ''),
        }),
      });
      if (res.ok) {
        setShowEditModal(false);
        setEditingProduct(null);
        fetchAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setEditAlert(data.message || 'Failed to update product details.');
      }
    } catch (err) {
      console.error(err);
      setEditAlert('Server connection error. Please try again.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to add this product to the catalog?')) return;
    try {
      const res = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          originalPrice: parseFloat(newProduct.originalPrice || newProduct.price),
          stock: parseInt(newProduct.stock),
          discount: parseInt(newProduct.discount || 0),
          rating: parseFloat(newProduct.rating || 5.0),
          reviews: parseInt(newProduct.reviews || 0),
          isNew: Boolean(newProduct.isNew),
          descriptionImages: newProduct.descriptionImages.filter(img => img.trim() !== ''),
          galleryImages: newProduct.galleryImages.filter(img => img.trim() !== ''),
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({
          name: '',
          price: '',
          originalPrice: '',
          category: 'Power Banks',
          brand: 'Anker',
          stock: 15,
          warranty: '1 Year Warranty',
          image: 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600',
          description: '',
          descriptionImages: [],
          galleryImages: [],
        });
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order Number,Customer,Phone,Amount,Status,Payment Method,Date"].join(",") + "\n"
      + orders.map(o => `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.totalAmount}","${o.status}","${o.paymentMethod}","${o.createdAt}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NVSHOP_Sales_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard & Reports', icon: Activity },
    { id: 'stock', label: 'Stock Management', icon: Warehouse },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'highlights', label: 'Weekly Highlights', icon: Star },
    { id: 'products', label: `Products (${products.length})`, icon: Package },
    { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
    { id: 'users', label: `Users (${usersList.length})`, icon: Users },
    { id: 'admins', label: `Admins (${adminsList.length})`, icon: ShieldCheck },
    { id: 'payments', label: `Transactions (${payments.length})`, icon: CreditCard },
    { id: 'customize', label: 'Customize Home', icon: ImageIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <img 
            src="/logo.png" 
            alt="NVSHOP.LK" 
            className="h-10 w-auto object-contain" 
          />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-bold text-slate-900 truncate">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6">
          <h2 className="text-lg font-bold text-slate-800">Admin Control Panel</h2>
        </header>

        <div className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">NVSHOP.LK ADMIN</span>
              <h1 className="text-3xl font-black text-slate-900 mt-1">Management Console</h1>
              <p className="text-slate-500 text-sm">Control inventory, process customer orders, view revenue analytics & user accounts.</p>
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={fetchAdminData} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
              <button onClick={handleExportCSV} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-500/20">
                <Download className="w-4 h-4" /> Export Report (CSV)
              </button>
            </div>
          </div>

          {/* Low Stock Alert Banner (FR2.6) */}
          {reportData.lowStockCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">Low Stock Alert (FR2.6)</h4>
                  <p className="text-xs text-amber-700">{reportData.lowStockCount} products are below the safety threshold (≤ 5 units remaining).</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('products')}
                className="px-3.5 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-all"
              >
                Review Stock
              </button>
            </div>
          )}



          {/* Tab 1: Dashboard & Reports (FR2.7) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">LKR {(reportData.totalRevenue || 0).toLocaleString()}</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ Verified Payments</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{reportData.totalOrders || orders.length}</h3>
                  <p className="text-[11px] text-blue-600 font-bold mt-1">{reportData.completedOrders || 0} Delivered</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Size</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{products.length} Items</h3>
                  <p className="text-[11px] text-purple-600 font-bold mt-1">11 Official Categories</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Accounts</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{usersList.length} Users</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">Active Accounts</p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900">Recent Customer Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-blue-600 hover:text-blue-700">View All Orders →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/60">
                          <td className="py-3 font-bold text-blue-600 font-mono">{o.orderNumber}</td>
                          <td className="py-3 font-semibold text-slate-800">{o.customerName}</td>
                          <td className="py-3 font-black text-slate-900">LKR {o.totalAmount?.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                              o.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500 font-semibold">{o.paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Weekly Highlights */}
          {activeTab === 'highlights' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Weekly Highlights</h3>
                  <p className="text-xs text-slate-500">Manage the products featured on the customer homepage.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3 text-right">Highlight Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className={`hover:bg-slate-50/60 transition-colors ${prod.isWeeklyHighlight ? 'bg-amber-50/30' : ''}`}>
                        <td className="py-3 flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-slate-100" />
                          <span className={`font-bold line-clamp-1 max-w-xs ${prod.isWeeklyHighlight ? 'text-amber-900' : 'text-slate-900'}`}>{prod.name}</span>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">{prod.category}</td>
                        <td className="py-3 font-black text-slate-900">LKR {prod.price?.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleToggleHighlight(prod.id)}
                            className={`px-3 py-1.5 rounded-lg transition-colors font-bold text-xs flex items-center justify-end ml-auto gap-1.5 ${prod.isWeeklyHighlight ? 'text-amber-700 bg-amber-100 hover:bg-amber-200' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}
                          >
                            <Star className={`w-3.5 h-3.5 ${prod.isWeeklyHighlight ? 'fill-amber-600 text-amber-600' : ''}`} />
                            {prod.isWeeklyHighlight ? 'Highlighted' : 'Set as Highlight'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Products Management (FR2.2) */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-base">Catalog & Stock ({products.length} Products)</h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Brand</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock Units</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/60">
                        <td className="py-3 flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100" />
                          <span className="font-bold text-slate-900 line-clamp-1 max-w-xs">{prod.name}</span>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">{prod.category}</td>
                        <td className="py-3 font-semibold text-slate-800">{prod.brand}</td>
                        <td className="py-3 font-black text-slate-900">LKR {prod.price?.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            prod.stock <= 5 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {prod.stock} left {prod.stock <= 5 ? '⚠️ Low' : ''}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1">
                          <button
                            onClick={() => handleToggleHighlight(prod.id)}
                            className={`p-1.5 rounded-lg transition-colors ${prod.isWeeklyHighlight ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'}`}
                            title={prod.isWeeklyHighlight ? 'Remove Weekly Highlight' : 'Set as Weekly Highlight'}
                          >
                            <Star className={`w-4 h-4 ${prod.isWeeklyHighlight ? 'fill-amber-500' : ''}`} />
                          </button>
                          <button 
                            onClick={() => handleEditClick(prod)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product Details"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Orders Management (FR2.4) */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 text-base">Customer Orders & Status Processing (FR2.4)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Order #</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Address</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Current Status</th>
                      <th className="pb-3 text-right">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/60">
                        <td className="py-3 font-bold text-blue-600 font-mono">{o.orderNumber}</td>
                        <td className="py-3">
                          <p className="font-bold text-slate-900">{o.customerName}</p>
                          <p className="text-[10px] text-slate-400">{o.customerPhone}</p>
                        </td>
                        <td className="py-3 text-slate-600 max-w-xs truncate">{o.shippingAddress}, {o.city}</td>
                        <td className="py-3 font-black text-slate-900">LKR {o.totalAmount?.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                            o.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                            o.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          {o.status !== 'PROCESSING' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'PROCESSING')} className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-bold">Process</button>
                          )}
                          {o.status !== 'SHIPPED' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'SHIPPED')} className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded text-[10px] font-bold">Ship</button>
                          )}
                          {o.status !== 'DELIVERED' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED')} className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold">Deliver</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Customer & Administrator Accounts (FR2.8) */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">User Management</h3>
                  <p className="text-xs text-slate-500">Manage customer accounts and statuses.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">User ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email & Phone</th>
                      <th className="pb-3">Account Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((usr) => {
                      const isAdmin = usr.role === 'admin' || usr.email?.toLowerCase().includes('admin');
                      return (
                        <tr key={usr.id} className="hover:bg-slate-50/60">
                          <td className="py-3.5 font-mono text-slate-400">#{usr.id}</td>
                          <td className="py-3.5 font-bold text-slate-900">{usr.name}</td>
                          <td className="py-3.5 text-slate-600">
                            <div>{usr.email}</div>
                            {usr.phone && <div className="text-[11px] text-slate-400 font-mono">{usr.phone}</div>}
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                              usr.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {usr.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleToggleUserStatus(usr.id)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 transition-all ${
                                usr.isActive
                                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {usr.isActive ? <Ban className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                              {usr.isActive ? 'Disable' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(usr.id)}
                              className="px-3 py-1.5 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 transition-all bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Admins Table */}
          {activeTab === 'admins' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Administrators</h3>
                  <p className="text-xs text-slate-500">Manage system administrators and super admins.</p>
                </div>
                <button
                  onClick={() => {
                    setAdminAlert(null);
                    setShowAddAdminModal(true);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" /> Add New Administrator
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Admin ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminsList.map((adm) => {
                      const isSuper = adm.role === 'SUPER_ADMIN';
                      return (
                        <tr key={adm.id} className="hover:bg-slate-50/60">
                          <td className="py-3.5 font-mono text-slate-400">#{adm.id}</td>
                          <td className="py-3.5 font-bold text-slate-900">{adm.name}</td>
                          <td className="py-3.5 text-slate-600">{adm.email}</td>
                          <td className="py-3.5">
                            {isSuper ? (
                              <span className="px-2.5 py-1 rounded-full font-extrabold text-[10px] bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-purple-600" /> SUPER ADMIN
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
                                <Shield className="w-3 h-3 text-blue-600" /> ADMIN
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            {admin?.role === 'SUPER_ADMIN' && admin?.id !== adm.id && (
                              <>
                                <button
                                  onClick={() => handleToggleAdminRole(adm.id)}
                                  className={`px-3 py-1.5 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 transition-all ${
                                    isSuper
                                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                                  }`}
                                >
                                  <Shield className="w-3 h-3" />
                                  {isSuper ? 'Demote to Admin' : 'Make Super Admin'}
                                </button>
                                <button
                                  onClick={() => handleDeleteAdmin(adm.id)}
                                  className="px-3 py-1.5 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 transition-all bg-red-50 text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Payment Transactions (FR3.3) */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 text-base">Payment Gateway Transactions Log (FR3.3)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Txn Reference</th>
                      <th className="pb-3">Order Number</th>
                      <th className="pb-3">Customer Email</th>
                      <th className="pb-3">Gateway</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60">
                        <td className="py-3 font-mono font-bold text-slate-900">{p.transactionReference}</td>
                        <td className="py-3 font-mono text-blue-600 font-bold">{p.orderNumber}</td>
                        <td className="py-3 text-slate-600">{p.userEmail}</td>
                        <td className="py-3 font-bold text-slate-700">{p.paymentGateway}</td>
                        <td className="py-3 font-black text-slate-900">LKR {p.amount?.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                            p.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Product Modal (FR2.2) */}
          {showAddModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-6xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-black text-lg text-slate-900">Add New Official Product</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Add Form */}
                  <div className="flex-1">
                    <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                    <input 
                      type="text" required 
                      value={newProduct.name} 
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Anker Soundcore Life Q35 Headphones"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price (LKR)</label>
                      <input 
                        type="number" required 
                        value={newProduct.price} 
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="24500"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Original Price</label>
                      <input 
                        type="number" 
                        value={newProduct.originalPrice} 
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                        placeholder="28000"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Stock</label>
                      <input 
                        type="number" required 
                        value={newProduct.stock} 
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        placeholder="15"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                      <input 
                        type="number" 
                        value={newProduct.discount} 
                        onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Rating</label>
                      <input 
                        type="number" step="0.1" max="5" 
                        value={newProduct.rating} 
                        onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Reviews</label>
                      <input 
                        type="number" 
                        value={newProduct.reviews} 
                        onChange={(e) => setNewProduct({ ...newProduct, reviews: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newProduct.isNew}
                          onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="font-bold text-slate-700">New Arrival</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select 
                        value={newProduct.category} 
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                      >
                        <option>Apple iPhone</option>
                        <option>Earphones & Headsets</option>
                        <option>Power Banks</option>
                        <option>Speakers</option>
                        <option>Chargers & Cables & Adapters</option>
                        <option>Phone Cases & Back Covers</option>
                        <option>Screen Protectors</option>
                        <option>Smart Watches</option>
                        <option>Mouse & Keyboards</option>
                        <option>Pendrives & SD Cards</option>
                        <option>Others</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Brand</label>
                      <input 
                        type="text" required 
                        value={newProduct.brand} 
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        placeholder="Anker, UGREEN, Apple"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Main Image URL</label>
                    <input 
                      type="url" required 
                      value={newProduct.image} 
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1">Additional Gallery Images (Up to 5)</label>
                    {[0, 1, 2, 3, 4].map(idx => (
                      <input 
                        key={`new-gallery-${idx}`}
                        type="url"
                        placeholder={`Gallery Image URL ${idx + 1}`}
                        value={(newProduct.galleryImages && newProduct.galleryImages[idx]) || ''}
                        onChange={(e) => {
                          const newGals = [...(newProduct.galleryImages || [])];
                          newGals[idx] = e.target.value;
                          setNewProduct({ ...newProduct, galleryImages: newGals });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                      />
                    ))}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                    <textarea 
                      rows={6}
                      required
                      placeholder={"Enter paragraph text here.\nUse '-' at the start of a line to create bullet points.\nUse 'Key Features:' to create a section header."}
                      value={newProduct.description || ''} 
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-medium resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1">Description Images (Up to 5)</label>
                    {[0, 1, 2, 3, 4].map(idx => (
                      <input 
                        key={`new-descimg-${idx}`}
                        type="url"
                        placeholder={`Description Image URL ${idx + 1}`}
                        value={(newProduct.descriptionImages && newProduct.descriptionImages[idx]) || ''}
                        onChange={(e) => {
                          const newDescImgs = [...(newProduct.descriptionImages || [])];
                          newDescImgs[idx] = e.target.value;
                          setNewProduct({ ...newProduct, descriptionImages: newDescImgs });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20">Save Product</button>
                  </div>
                    </form>
                  </div>
                  
                  {/* Right: Live Preview */}
                  <div className="w-full lg:w-[320px] bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-start h-max sticky top-6">
                    <p className="text-[10px] font-bold text-blue-600 mb-4 uppercase tracking-widest text-center">Live Preview</p>
                    <AdminProductPreview product={newProduct} label="PREVIEW" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Product Modal (FR2.2) */}
          {showEditModal && editingProduct && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-6xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                      <Pencil className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900 leading-tight">Edit Product Details</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Modify inventory specs, pricing (LKR), or stock levels</p>
                    </div>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                {editAlert && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
                    {editAlert}
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Edit Form */}
                  <div className="flex-1">
                    <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                    <input 
                      type="text" required 
                      value={editingProduct.name} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price (LKR)</label>
                      <input 
                        type="number" required 
                        value={editingProduct.price} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Original Price</label>
                      <input 
                        type="number" 
                        value={editingProduct.originalPrice} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Stock</label>
                      <input 
                        type="number" required 
                        value={editingProduct.stock} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                      <input 
                        type="number" 
                        value={editingProduct.discount} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Rating</label>
                      <input 
                        type="number" step="0.1" max="5" 
                        value={editingProduct.rating} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, rating: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Reviews</label>
                      <input 
                        type="number" 
                        value={editingProduct.reviews} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, reviews: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                      />
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={editingProduct.isNew}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="font-bold text-slate-700">New Arrival</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select 
                        value={editingProduct.category} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white text-slate-900 font-medium"
                      >
                        <option>Apple iPhone</option>
                        <option>Earphones & Headsets</option>
                        <option>Power Banks</option>
                        <option>Speakers</option>
                        <option>Chargers & Cables & Adapters</option>
                        <option>Phone Cases & Back Covers</option>
                        <option>Screen Protectors</option>
                        <option>Smart Watches</option>
                        <option>Mouse & Keyboards</option>
                        <option>Pendrives & SD Cards</option>
                        <option>Others</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Brand</label>
                      <input 
                        type="text" required 
                        value={editingProduct.brand} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Main Image URL</label>
                    <input 
                      type="url" required 
                      value={editingProduct.image} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1">Additional Gallery Images (Up to 5)</label>
                    {[0, 1, 2, 3, 4].map(idx => (
                      <input 
                        key={`edit-gallery-${idx}`}
                        type="url"
                        placeholder={`Gallery Image URL ${idx + 1}`}
                        value={(editingProduct.galleryImages && editingProduct.galleryImages[idx]) || ''}
                        onChange={(e) => {
                          const newGals = [...(editingProduct.galleryImages || [])];
                          newGals[idx] = e.target.value;
                          setEditingProduct({ ...editingProduct, galleryImages: newGals });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                      />
                    ))}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                    <textarea 
                      rows={6}
                      required
                      placeholder={"Enter paragraph text here.\nUse '-' at the start of a line to create bullet points.\nUse 'Key Features:' to create a section header."}
                      value={editingProduct.description} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-medium resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1">Description Images (Up to 5)</label>
                    {[0, 1, 2, 3, 4].map(idx => (
                      <input 
                        key={`edit-descimg-${idx}`}
                        type="url"
                        placeholder={`Description Image URL ${idx + 1}`}
                        value={(editingProduct.descriptionImages && editingProduct.descriptionImages[idx]) || ''}
                        onChange={(e) => {
                          const newDescImgs = [...(editingProduct.descriptionImages || [])];
                          newDescImgs[idx] = e.target.value;
                          setEditingProduct({ ...editingProduct, descriptionImages: newDescImgs });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono text-[11px]"
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowEditModal(false)} 
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={editSaving}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-blue-500/20"
                    >
                      {editSaving ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                    </form>
                  </div>

                  {/* Right: Live Preview */}
                  <div className="w-full lg:w-[620px] bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start justify-start h-max sticky top-6">
                    <div className="flex-1 w-full flex flex-col items-center">
                      <p className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest text-center">Before (Current)</p>
                      <AdminProductPreview product={products.find(p => p.id === editingProduct.id) || editingProduct} label="BEFORE" />
                    </div>
                    <div className="hidden md:flex items-center text-slate-300 self-center">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                    <div className="flex-1 w-full flex flex-col items-center">
                      <p className="text-[10px] font-bold text-blue-600 mb-4 uppercase tracking-widest text-center">Live Preview</p>
                      <AdminProductPreview product={editingProduct} label="AFTER" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add New Administrator Modal (FR2.8) */}
          {showAddAdminModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900 leading-tight">Add Administrator</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Create a new system manager account</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddAdminModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                {adminAlert && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
                    {adminAlert}
                  </div>
                )}

                <form onSubmit={handleCreateAdmin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" required 
                      value={newAdmin.name} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      placeholder="e.g. Mayantha Nawarathna (Manager)"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Admin Email Address</label>
                    <input 
                      type="email" required 
                      value={newAdmin.email} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      placeholder="admin2@example.com"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone (Hotline/2FA)</label>
                    <input 
                      type="text" 
                      value={newAdmin.phone} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                      placeholder="+94 76 989 0079"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Master Password (min 6 characters)</label>
                    <input 
                      type="password" required minLength={6}
                      value={newAdmin.password} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
                    />
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button 
                      type="button" 
                      onClick={() => setShowAddAdminModal(false)} 
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={adminSaving}
                      className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-purple-500/20"
                    >
                      {adminSaving ? 'Creating...' : 'Create Admin'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Tab 6: Customize Home */}
          {activeTab === 'customize' && (
            <CustomizeHomeTab />
          )}

          {/* Tab 7: Stock Management */}
          {activeTab === 'stock' && (
            <StockManagementTab 
              products={products} 
              onUpdateStock={() => fetchAdminData()} 
            />
          )}

          {/* Tab 8: Suppliers */}
          {activeTab === 'suppliers' && (
            <SuppliersTab />
          )}

          </div>
        </div>
      </main>
    </div>
  );
}