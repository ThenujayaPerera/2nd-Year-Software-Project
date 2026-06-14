import { useState } from 'react';
import Layout from '../components/Layout';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  TrendingUp, TrendingDown, ArrowRight, Plus, Pencil, Trash2,
  Eye, RefreshCw, Download, Search, Filter, MoreVertical
} from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: 'LKR 4,52,310', change: '+12%', up: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Total Orders', value: '1,245', change: '+8%', up: true, icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
  { label: 'Total Products', value: '487', change: '+3%', up: true, icon: Package, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { label: 'Active Users', value: '2,456', change: '-2%', up: false, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
];

const MOCK_ORDERS = [
  { id: 'NV-1001', customer: 'Saman Perera', status: 'Delivered', total: 15600, date: '2026-06-10', items: 2 },
  { id: 'NV-1002', customer: 'Nimal Silva', status: 'Processing', total: 8900, date: '2026-06-12', items: 1 },
  { id: 'NV-1003', customer: 'Kamani Fernando', status: 'Pending', total: 24500, date: '2026-06-13', items: 3 },
  { id: 'NV-1004', customer: 'Ruwan Jayawardena', status: 'Shipped', total: 4900, date: '2026-06-13', items: 1 },
  { id: 'NV-1005', customer: 'Dilhani Wickramasinghe', status: 'Cancelled', total: 12000, date: '2026-06-11', items: 2 },
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'UGREEN Nexode 65W GaN Charger', category: 'Chargers', price: 9800, stock: 12, sales: 128, status: 'Active' },
  { id: 2, name: 'Anker PowerLine III USB-C Cable', category: 'Cables', price: 3400, stock: 25, sales: 96, status: 'Active' },
  { id: 3, name: 'Baseus 20000mAh Power Bank', category: 'Wireless', price: 11200, stock: 8, sales: 84, status: 'Active' },
  { id: 4, name: 'Aspor A616 TWS Earphones', category: 'Audio', price: 4900, stock: 0, sales: 53, status: 'Out of Stock' },
  { id: 5, name: 'Spigen Tough Armor Case', category: 'Cases', price: 6200, stock: 40, sales: 210, status: 'Active' },
];

const statusStyles = {
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Processing: 'bg-blue-50 text-blue-700 border-blue-100',
  Pending: 'bg-amber-50 text-amber-700 border-amber-100',
  Shipped: 'bg-violet-50 text-violet-700 border-violet-100',
  Cancelled: 'bg-red-50 text-red-600 border-red-100',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Out of Stock': 'bg-red-50 text-red-600 border-red-100',
};

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <span className="text-primary font-bold text-xs tracking-widest uppercase">Admin</span>
              <h1 className="text-3xl font-black text-slate-900 mt-1">Control Panel</h1>
              <p className="text-slate-500 text-sm mt-1">Manage NV-SHOP's entire operation from here.</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary text-sm gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button className="btn-primary text-sm gap-2">
                <Download className="w-4 h-4" /> Export Report
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-slate-100 rounded-2xl p-1.5 flex gap-1 mb-10 overflow-x-auto shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className={`bg-white rounded-2xl border ${stat.border} p-6 shadow-sm`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <span className={`text-xs font-bold flex items-center gap-1 ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                        {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-6 py-3 text-left">Order ID</th>
                        <th className="px-6 py-3 text-left">Customer</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Total</th>
                        <th className="px-6 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_ORDERS.slice(0, 3).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-700">{order.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{order.customer}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyles[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">LKR {order.total.toLocaleString()}</td>
                          <td className="px-6 py-4 text-slate-500">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="search" placeholder="Search products..." className="input-premium pl-11 text-sm" />
                </div>
                <button className="btn-primary text-sm">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-6 py-4 text-left">Product</th>
                        <th className="px-6 py-4 text-left">Category</th>
                        <th className="px-6 py-4 text-left">Price</th>
                        <th className="px-6 py-4 text-left">Stock</th>
                        <th className="px-6 py-4 text-left">Sales</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_PRODUCTS.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-900">{product.name}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-semibold">{product.category}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">LKR {product.price.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`font-bold ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-amber-600' : 'text-slate-900'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{product.sales}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyles[product.status]}`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="search" placeholder="Search orders..." className="input-premium pl-11 text-sm" />
                </div>
                <button className="btn-secondary text-sm">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-6 py-4 text-left">Order ID</th>
                        <th className="px-6 py-4 text-left">Customer</th>
                        <th className="px-6 py-4 text-left">Items</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Total</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_ORDERS.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-primary">{order.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{order.customer}</td>
                          <td className="px-6 py-4 text-slate-500">{order.items} item{order.items > 1 ? 's' : ''}</td>
                          <td className="px-6 py-4">
                            <select className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${statusStyles[order.status]}`}>
                              <option>{order.status}</option>
                              <option>Pending</option>
                              <option>Processing</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                              <option>Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">LKR {order.total.toLocaleString()}</td>
                          <td className="px-6 py-4 text-slate-500">{order.date}</td>
                          <td className="px-6 py-4">
                            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">User Management</h3>
              <p className="text-slate-400 text-sm">Full user management with roles & permissions coming soon.</p>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-lg">
              <h3 className="font-black text-slate-900 text-xl mb-6">Store Settings</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Store Name</label>
                  <input type="text" defaultValue="NV-SHOP" className="input-premium" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Store Email</label>
                  <input type="email" defaultValue="nvshopamba@gmail.com" className="input-premium" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Contact Number</label>
                  <input type="tel" defaultValue="+94 76 989 0079" className="input-premium" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">WhatsApp Number</label>
                  <input type="tel" defaultValue="+94 76 989 0079" className="input-premium" />
                </div>
                <button className="btn-primary w-full justify-center">Save Settings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}