import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, AlertCircle, ShoppingBag, ArrowRight, ShieldCheck, MessageSquare, Download } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store';

export default function Orders() {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDemoUser = () => {
    setUser({
      id: 1,
      name: 'Alice Doe',
      email: 'alice@example.com',
      phone: '+94 76 989 0079',
      address: '185/1/2B New Road, Ambalangoda',
    });
  };

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      fetch(`http://localhost:8080/api/orders/my-orders?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch((err) => console.warn('Could not fetch live orders:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.email]);

  const statusColors = {
    PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
    SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-6 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs tracking-widest uppercase">NVSHOP.LK ORDERS</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1">My Orders & Tracking</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time status updates and order history (FR1.8)</p>
            </div>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <ShoppingBag className="w-4 h-4" /> Shop More
            </Link>
          </div>

          {!isAuthenticated && !user ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Track Your Orders</h2>
                <p className="text-slate-600 text-sm">Please log in to view your placed orders, tracking numbers, and warranty details.</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Sign In to Account
                </Link>
                <button
                  onClick={handleDemoUser}
                  className="px-6 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all"
                >
                  Preview as Guest
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-10 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-6">
              <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">No Orders Placed Yet</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">You haven't made any purchases with account {user?.email}. Browse our official collection to place your first order!</p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6 transition-all hover:shadow-md">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-slate-900 font-mono">{order.orderNumber}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[order.status] || 'bg-slate-100 text-slate-800'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">Total Amount</p>
                      <p className="text-xl font-black text-blue-600">LKR {order.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Status Progress Bar */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                      <span className={order.status ? 'text-blue-600' : ''}>1. Order Confirmed</span>
                      <span className={['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-blue-600' : ''}>2. Processing</span>
                      <span className={['SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-blue-600' : ''}>3. On the Way</span>
                      <span className={order.status === 'DELIVERED' ? 'text-emerald-600' : ''}>4. Delivered</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          order.status === 'DELIVERED' ? 'w-full bg-emerald-600' :
                          order.status === 'SHIPPED' ? 'w-3/4 bg-purple-600' :
                          order.status === 'PROCESSING' ? 'w-1/2 bg-blue-600' : 'w-1/4 bg-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items</h4>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                          <div className="flex items-center gap-3">
                            {item.productImage && (
                              <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-100" />
                            )}
                            <div>
                              <p className="font-bold text-sm text-slate-900 line-clamp-1">{item.productName}</p>
                              <p className="text-xs text-slate-500">Qty: {item.quantity} × LKR {item.price?.toLocaleString()}</p>
                            </div>
                          </div>
                          <span className="font-bold text-sm text-slate-900">LKR {item.subtotal?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer & Delivery Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    <div>
                      <p><strong>Delivery Address:</strong> {order.shippingAddress}, {order.city}</p>
                      <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
                    </div>
                    <a
                      href="https://wa.me/94769890079"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" /> WhatsApp Support
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
