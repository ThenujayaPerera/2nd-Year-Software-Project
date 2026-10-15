import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, AlertCircle, ShoppingBag, ArrowRight, ShieldCheck, MessageSquare, Download, Star, X } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store';
import { downloadDirectInvoicePdf } from '../utils/invoicePdf';
import { API_BASE_URL, reviewAPI } from '../services/api';

export default function Orders() {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const handleDemoUser = () => {
    setUser({
      id: 1,
      name: 'Alice Doe',
      email: 'alice@example.com',
      phone: '+94 76 989 0079',
      address: '185/1/2B New Road, Ambalangoda',
    });
  };

  const fetchUserReviews = useCallback(() => {
    if (!user?.email) return;
    reviewAPI.getUserReviews(user.email)
      .then((res) => {
        if (Array.isArray(res.data)) setUserReviews(res.data);
      })
      .catch((err) => console.warn('Could not fetch user reviews:', err));
  }, [user?.email]);

  const fetchOrders = useCallback((silent = false) => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    fetch(`${API_BASE_URL}/orders/my-orders?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch((err) => console.warn('Could not fetch live orders:', err))
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, [user?.email]);

  const handleOpenReview = (order, item) => {
    setReviewModal({ order, item });
    setReviewRating(5);
    setReviewHoverRating(0);
    setReviewComment('');
    setReviewError('');
    setReviewSuccess('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModal) return;
    if (!reviewComment.trim()) {
      setReviewError('Please enter a review comment before submitting.');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');

    try {
      await reviewAPI.submit({
        productId: reviewModal.item.productId,
        orderNumber: reviewModal.order.orderNumber,
        userEmail: user?.email,
        userName: user?.name || user?.email?.split('@')[0] || 'Verified Customer',
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewSuccess('Thank you! Your feedback has been received and will appear after administrator approval.');
      fetchUserReviews();
      setTimeout(() => {
        setReviewModal(null);
        setReviewSuccess('');
      }, 2200);
    } catch (err) {
      console.error('Failed to submit review:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to submit review. Please try again.';
      setReviewError(msg);
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
    fetchUserReviews();

    if (!user?.email) return;

    // Connect to real-time SSE stream for instant order updates
    let eventSource = null;
    try {
      const streamUrl = `${API_BASE_URL}/orders/stream?email=${encodeURIComponent(user.email)}`;
      eventSource = new EventSource(streamUrl);
      eventSource.addEventListener('ORDER_STATUS_UPDATE', () => {
        fetchOrders(true);
        fetchUserReviews();
      });
      eventSource.onerror = () => {
        // Fallback gracefully handled by interval heartbeat
      };
    } catch (err) {
      console.warn('SSE stream unavailable:', err);
    }

    // Interval heartbeat poll (every 6 seconds) + focus sync
    const interval = setInterval(() => {
      fetchOrders(true);
      fetchUserReviews();
    }, 6000);
    const onFocus = () => {
      fetchOrders(true);
      fetchUserReviews();
    };
    window.addEventListener('focus', onFocus);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [user?.email, fetchOrders, fetchUserReviews]);

  const statusColors = {
    PLACED: 'bg-blue-100 text-blue-800 border-blue-200',
    PROCESSING: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-6 sm:py-12 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-blue-600 font-bold text-[11px] sm:text-xs tracking-widest uppercase">NVSHOP.LK ORDERS</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Live Tracking Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-0.5 sm:mt-1">My Orders & Tracking</h1>
              <p className="text-slate-500 text-xs sm:text-sm">Real-time status updates and order history</p>
            </div>
            <Link
              to="/products"
              className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
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
                <div key={order.id} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-sm space-y-4 sm:space-y-6 transition-all hover:shadow-md">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span className="text-base sm:text-lg font-black text-slate-900 font-mono">{order.orderNumber}</span>
                        <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase border ${statusColors[order.status] || 'bg-slate-100 text-slate-800'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Total Amount</p>
                      <p className="text-lg sm:text-xl font-black text-blue-600">LKR {order.totalAmount?.toLocaleString()}</p>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5 space-x-1.5">
                        <span>Subtotal: LKR {(order.subtotal || 0).toLocaleString()}</span>
                        <span>•</span>
                        <span>VAT: LKR {(order.tax || 0).toLocaleString()}</span>
                        <span>•</span>
                        <span>Delivery: {(order.shippingCost || 0) === 0 ? 'FREE' : `LKR ${(order.shippingCost || 0).toLocaleString()}`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Bar */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-5 border border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 mb-2.5">
                      <span className="font-bold text-slate-800">
                        {order.status === 'PENDING' ? 'Awaiting Store Review & Confirmation' :
                         order.status === 'PLACED' ? 'Order Confirmed & Placed' :
                         order.status === 'PROCESSING' ? 'Order In Processing & Quality Inspection' :
                         order.status === 'SHIPPED' ? 'Package On The Way (In Transit)' :
                         order.status === 'DELIVERED' ? 'Delivered to Customer Destination' :
                         'Status: ' + order.status}
                      </span>
                      {order.status === 'PENDING' && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 w-fit">
                          Tracking line activates once store confirms order
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-[10px] sm:text-xs font-bold text-slate-400 mb-2 text-center">
                      <span className={['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-blue-600 font-black' : ''}>
                        {['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? '✓ 1. Placed' : '1. Placed'}
                      </span>
                      <span className={['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-blue-600 font-black' : ''}>
                        {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? '✓ 2. Processing' : '2. Processing'}
                      </span>
                      <span className={['SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-purple-600 font-black' : ''}>
                        {['SHIPPED', 'DELIVERED'].includes(order.status) ? '✓ 3. On Way' : '3. On Way'}
                      </span>
                      <span className={order.status === 'DELIVERED' ? 'text-emerald-600 font-black' : ''}>
                        {order.status === 'DELIVERED' ? '✓ 4. Delivered' : '4. Delivered'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 sm:h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          order.status === 'DELIVERED' ? 'w-full bg-emerald-600' :
                          order.status === 'SHIPPED' ? 'w-3/4 bg-purple-600' :
                          order.status === 'PROCESSING' ? 'w-1/2 bg-blue-600' :
                          order.status === 'PLACED' ? 'w-1/4 bg-blue-500' : 'w-0'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items</h4>
                    <div className="space-y-2">
                      {order.items?.map((item) => {
                        const existingReview = userReviews.find(
                          (r) => r.orderNumber === order.orderNumber && Number(r.productId) === Number(item.productId)
                        );

                        return (
                          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                            <div className="flex items-center gap-3">
                              {item.productImage && (
                                <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-100" />
                              )}
                              <div>
                                <p className="font-bold text-sm text-slate-900 line-clamp-1">{item.productName}</p>
                                <p className="text-xs text-slate-500">Qty: {item.quantity} × LKR {item.price?.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                              <span className="font-bold text-sm text-slate-900">LKR {item.subtotal?.toLocaleString()}</span>

                              {order.status === 'DELIVERED' && (
                                existingReview ? (
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                                    existingReview.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    existingReview.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                    'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    {existingReview.status === 'APPROVED' ? 'Review Approved' :
                                     existingReview.status === 'REJECTED' ? 'Review Rejected' :
                                     'Review Under Moderation'}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleOpenReview(order, item)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                                  >
                                    <Star className="w-3.5 h-3.5 fill-white" />
                                    Rate & Review
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Footer & Delivery Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    <div>
                      <p><strong>Delivery Address:</strong> {order.shippingAddress}, {order.city}</p>
                      <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadDirectInvoicePdf(order, user)}
                        className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-4 h-4" /> Download Invoice
                      </button>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rate & Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Verified Customer Review</span>
                <h3 className="text-lg font-black text-slate-900">Rate & Review Product</h3>
              </div>
              <button
                onClick={() => setReviewModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
              {/* Product preview */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                {reviewModal.item.productImage && (
                  <img src={reviewModal.item.productImage} alt={reviewModal.item.productName} className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-100" />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{reviewModal.item.productName}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Order: {reviewModal.order.orderNumber} • Delivered</p>
                </div>
              </div>

              {/* Rating Star Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (reviewHoverRating || reviewRating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                        aria-label={`${star} star`}
                      >
                        <Star className={`w-8 h-8 ${active ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {(reviewHoverRating || reviewRating) === 5 ? '5 Stars - Excellent' :
                     (reviewHoverRating || reviewRating) === 4 ? '4 Stars - Very Good' :
                     (reviewHoverRating || reviewRating) === 3 ? '3 Stars - Good' :
                     (reviewHoverRating || reviewRating) === 2 ? '2 Stars - Fair' :
                     '1 Star - Poor'}
                  </span>
                </div>
              </div>

              {/* Comment textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Comment & Feedback
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Write your honest thoughts about product quality, performance, packaging, or delivery experience..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Note: All reviews are moderated and verified before appearing publicly on the product and testimonials pages.
                </p>
              </div>

              {reviewError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                  {reviewError}
                </div>
              )}

              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200">
                  {reviewSuccess}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting || !reviewComment.trim()}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
