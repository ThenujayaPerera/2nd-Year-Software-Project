import { useState } from 'react';
import { Package, Clock, CheckCircle, AlertCircle, Calendar, Shield, Download, MessageSquare, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store';
import Layout from '../components/Layout';

export default function UserProfile() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedItem, setExpandedItem] = useState(null);

  // Mock data - replace with API calls
  const pendingItems = [
    {
      id: 1,
      name: 'Anker PowerCore 30000mAh',
      orderId: 'ORD-001',
      orderDate: '2024-01-15',
      estimatedDelivery: '2024-01-20',
      status: 'Processing',
      price: 45.99,
      warranty: '2 Years',
      color: 'Black',
      quantity: 1,
      daysRemaining: 3,
    },
    {
      id: 2,
      name: 'UGREEN USB-C Hub 7-in-1',
      orderId: 'ORD-002',
      orderDate: '2024-01-18',
      estimatedDelivery: '2024-01-25',
      status: 'Shipped',
      price: 59.99,
      warranty: '1 Year',
      color: 'Silver',
      quantity: 1,
      daysRemaining: 4,
    },
  ];

  const boughtItems = [
    {
      id: 101,
      name: 'Baseus 100W Fast Charger',
      purchaseDate: '2023-12-01',
      expiryDate: '2025-12-01',
      warrantyDaysRemaining: 350,
      status: 'Active',
      price: 34.99,
      warranty: '2 Years',
      invoiceId: 'INV-2023-001',
      color: 'White',
      daysUsed: 15,
    },
    {
      id: 102,
      name: 'Anker 511 Charger Cable 2m',
      purchaseDate: '2023-11-20',
      expiryDate: '2024-11-20',
      warrantyDaysRemaining: 322,
      status: 'Active',
      price: 12.99,
      warranty: '1 Year',
      invoiceId: 'INV-2023-002',
      color: 'Black',
      daysUsed: 52,
    },
    {
      id: 103,
      name: 'UGREEN Screen Protector 3-Pack',
      purchaseDate: '2023-10-15',
      expiryDate: '2024-10-15',
      warrantyDaysRemaining: 267,
      status: 'Active',
      price: 19.99,
      warranty: '1 Year',
      invoiceId: 'INV-2023-003',
      color: 'Clear',
      daysUsed: 92,
    },
    {
      id: 104,
      name: 'Baseus Phone Stand',
      purchaseDate: '2023-07-10',
      expiryDate: '2024-07-10',
      warrantyDaysRemaining: 27,
      status: 'Expiring Soon',
      price: 9.99,
      warranty: '1 Year',
      invoiceId: 'INV-2023-004',
      color: 'Black',
      daysUsed: 218,
    },
  ];

  const getWarrantyColor = (daysRemaining) => {
    if (daysRemaining > 180) return 'text-green-600';
    if (daysRemaining > 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'Processing':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'Shipped':
        return `${baseClasses} bg-purple-100 text-purple-700`;
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'Expiring Soon':
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return `${baseClasses} bg-slate-100 text-slate-700`;
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  Welcome, {user?.name?.split(' ')[0]}!
                </h1>
                <div className="space-y-1 text-slate-600">
                  <p className="flex items-center gap-2">
                    <span className="text-sm">📧</span> {user?.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-sm">📱</span> {user?.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-sm">📍</span> {user?.address}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-black text-primary">{pendingItems.length}</p>
                  <p className="text-xs text-slate-600 mt-1">Pending Items</p>
                </div>
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <p className="text-2xl font-black text-green-600">{boughtItems.length}</p>
                  <p className="text-xs text-slate-600 mt-1">Items Bought</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-4 px-4 font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'pending'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-5 h-5" />
              Pending Items ({pendingItems.length})
            </button>
            <button
              onClick={() => setActiveTab('bought')}
              className={`pb-4 px-4 font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'bought'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Items Bought ({boughtItems.length})
            </button>
          </div>

          {/* Pending Items Section */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingItems.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">No pending items</p>
                </div>
              ) : (
                pendingItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
                    <div
                      className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                            <ChevronDown
                              className={`w-5 h-5 text-slate-400 transition-transform ${
                                expandedItem === item.id ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                          <p className="text-sm text-slate-500 mb-3">Order #{item.orderId}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className={getStatusBadge(item.status)}>{item.status}</span>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Calendar className="w-4 h-4" />
                              Arrives in {item.daysRemaining} days
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-primary">${item.price.toFixed(2)}</p>
                          <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedItem === item.id && (
                        <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wide">Order Date</p>
                              <p className="font-semibold text-slate-900">{new Date(item.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wide">Estimated Delivery</p>
                              <p className="font-semibold text-slate-900">{new Date(item.estimatedDelivery).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wide">Color</p>
                              <p className="font-semibold text-slate-900">{item.color}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-blue-600 font-semibold">WARRANTY INCLUDED</p>
                                <p className="text-sm font-bold text-blue-900">{item.warranty}</p>
                              </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              Track Order
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Items Bought Section */}
          {activeTab === 'bought' && (
            <div className="space-y-4">
              {boughtItems.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">No purchased items yet</p>
                </div>
              ) : (
                boughtItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
                    <div
                      className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                            <ChevronDown
                              className={`w-5 h-5 text-slate-400 transition-transform ${
                                expandedItem === item.id ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                          <p className="text-sm text-slate-500 mb-3">Invoice #{item.invoiceId}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className={getStatusBadge(item.status)}>{item.status}</span>
                            <div className="flex items-center gap-2">
                              <Shield className={`w-4 h-4 ${getWarrantyColor(item.warrantyDaysRemaining)}`} />
                              <span className={`font-semibold ${getWarrantyColor(item.warrantyDaysRemaining)}`}>
                                {item.warrantyDaysRemaining} days left
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-primary">${item.price.toFixed(2)}</p>
                          <p className="text-xs text-slate-500 mt-1">Used: {item.daysUsed} days</p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedItem === item.id && (
                        <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wide">Purchase Date</p>
                              <p className="font-semibold text-slate-900">{new Date(item.purchaseDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wide">Warranty Expiry</p>
                              <p className="font-semibold text-slate-900">{new Date(item.expiryDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wide">Color</p>
                              <p className="font-semibold text-slate-900">{item.color}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className={`p-3 rounded-lg ${
                              item.warrantyDaysRemaining > 90 
                                ? 'bg-green-50' 
                                : item.warrantyDaysRemaining > 30 
                                ? 'bg-yellow-50' 
                                : 'bg-red-50'
                            }`}>
                              <p className={`text-xs font-semibold uppercase tracking-wide ${
                                item.warrantyDaysRemaining > 90 
                                  ? 'text-green-600' 
                                  : item.warrantyDaysRemaining > 30 
                                  ? 'text-yellow-600' 
                                  : 'text-red-600'
                              }`}>
                                WARRANTY STATUS
                              </p>
                              <p className={`text-sm font-bold mt-1 ${
                                item.warrantyDaysRemaining > 90 
                                  ? 'text-green-900' 
                                  : item.warrantyDaysRemaining > 30 
                                  ? 'text-yellow-900' 
                                  : 'text-red-900'
                              }`}>
                                {item.warranty} ({item.warrantyDaysRemaining} days remaining)
                              </p>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                              Download Invoice
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
