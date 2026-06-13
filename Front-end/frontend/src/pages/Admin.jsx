import { useState } from 'react';
import Layout from '../components/Layout';
import Alert from '../components/Alert';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([
    { id: 1, name: 'Phone Case', price: 19.99, stock: 45, sales: 128 },
    { id: 2, name: 'USB-C Charger', price: 34.99, stock: 23, sales: 89 },
  ]);
  const [orders, setOrders] = useState([
    { id: 1, customer: 'John Doe', status: 'Delivered', total: 156.99, date: '2024-01-15' },
    { id: 2, customer: 'Jane Smith', status: 'Processing', total: 89.50, date: '2024-01-14' },
  ]);

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'products', label: '📦 Products' },
    { id: 'orders', label: '📋 Orders' },
    { id: 'users', label: '👥 Users' },
    { id: 'settings', label: '⚙️ Settings' },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+12%', color: 'text-green-600' },
    { label: 'Total Orders', value: '1,245', change: '+8%', color: 'text-blue-600' },
    { label: 'Total Products', value: '487', change: '+3%', color: 'text-purple-600' },
    { label: 'Active Users', value: '2,456', change: '+15%', color: 'text-orange-600' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your e-commerce store</p>
          </div>
          <button className="btn-primary">
            Export Report
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="card">
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    <span className={`text-sm font-semibold ${stat.color}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Total</th>
                      <th className="px-4 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">#{order.id}</td>
                        <td className="px-4 py-2">{order.customer}</td>
                        <td className="px-4 py-2">
                          <span className={`badge ${
                            order.status === 'Delivered' ? 'badge-success' :
                            order.status === 'Processing' ? 'badge-primary' : 'badge-danger'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-semibold">${order.total}</td>
                        <td className="px-4 py-2">{order.date}</td>
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
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Manage Products</h3>
              <button className="btn-primary">+ Add Product</button>
            </div>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Product Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Sales</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{product.name}</td>
                      <td className="px-4 py-2">${product.price}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                      <td className="px-4 py-2">{product.sales}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">All Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">#{order.id}</td>
                      <td className="px-4 py-2">{order.customer}</td>
                      <td className="px-4 py-2">
                        <select className="text-sm px-2 py-1 border rounded">
                          <option>{order.status}</option>
                          <option>Pending</option>
                          <option>Processing</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 font-semibold">${order.total}</td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 hover:text-blue-800">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Store Name</label>
                <input type="text" defaultValue="NV-SHOP" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Store Email</label>
                <input type="email" defaultValue="info@nvshop.com" className="input-field" />
              </div>
              <button className="btn-primary">Save Settings</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}