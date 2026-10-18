import React, { useState, useEffect } from 'react';
import { 
  Star, Search, RefreshCw, Check, X, Trash2, ShieldCheck, 
  AlertCircle, MessageSquare, Clock, Filter, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_BASE = `${API_BASE_URL}/admin`;

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [processingId, setProcessingId] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } else {
        showAlert('error', 'Failed to fetch reviews list from server.');
      }
    } catch (e) {
      console.error(e);
      showAlert('error', 'Network error connecting to backend service.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertMsg({ type, message });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleUpdateStatus = async (reviewId, newStatus) => {
    setProcessingId(reviewId);
    try {
      const res = await fetch(`${API_BASE}/reviews/${reviewId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: `Status changed to ${newStatus} by Administrator.` })
      });

      if (res.ok) {
        showAlert('success', `Review marked as ${newStatus} successfully.`);
        fetchReviews();
      } else {
        const err = await res.json().catch(() => ({}));
        showAlert('error', err.message || 'Failed to update review status.');
      }
    } catch (e) {
      console.error(e);
      showAlert('error', 'Network error updating review status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) return;
    setProcessingId(reviewId);
    try {
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showAlert('success', 'Customer review deleted permanently.');
        fetchReviews();
      } else {
        showAlert('error', 'Failed to delete customer review.');
      }
    } catch (e) {
      console.error(e);
      showAlert('error', 'Network error deleting customer review.');
    } finally {
      setProcessingId(null);
    }
  };

  // Metrics
  const totalReviews = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;
  const approvedCount = reviews.filter((r) => r.status === 'APPROVED').length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1)
    : '0.0';

  // Filtering
  const filteredReviews = reviews.filter((rev) => {
    const matchesStatus = statusFilter === 'ALL' || rev.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      (rev.productName && rev.productName.toLowerCase().includes(q)) ||
      (rev.userName && rev.userName.toLowerCase().includes(q)) ||
      (rev.userEmail && rev.userEmail.toLowerCase().includes(q)) ||
      (rev.orderNumber && rev.orderNumber.toLowerCase().includes(q)) ||
      (rev.comment && rev.comment.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
            Feedback Moderation
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Customer Reviews & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Moderate and approve customer feedback submitted for delivered orders before public display.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Reviews
        </button>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{alertMsg.message}</span>
          <button onClick={() => setAlertMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Reviews</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalReviews}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Delivered order feedback</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending Moderation</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Requires admin action</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Approved Live</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Visible to public shoppers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Average Rating</span>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-black text-blue-600">{avgRating}</p>
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Scale 1.0 to 5.0</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product, buyer, email or order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Reviews' },
            { id: 'PENDING', label: `Pending (${pendingCount})` },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'REJECTED', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table / Feed */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Loading reviews queue from database...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Customer Reviews Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'ALL'
                ? 'No reviews match your search or filter criteria.'
                : 'Delivered orders will appear here once customers submit their feedback.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 sm:p-6 transition-colors hover:bg-slate-50/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Product & Buyer Info */}
                <div className="space-y-3 max-w-2xl">
                  {/* Product Header */}
                  <div className="flex items-center gap-3">
                    {rev.productImage ? (
                      <img
                        src={rev.productImage}
                        alt={rev.productName}
                        className="w-12 h-12 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                        ID: {rev.productId}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{rev.productName || `Product #${rev.productId}`}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Order Ref: <strong className="text-slate-700">{rev.orderNumber}</strong> • Delivered
                      </p>
                    </div>
                  </div>

                  {/* Customer Rating & Comment */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${(rev.rating || 5) >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{rev.rating} / 5 Stars</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-200/50">
                      <span>Submitted by: <strong className="text-slate-600">{rev.userName}</strong> ({rev.userEmail})</span>
                      <span>•</span>
                      <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      rev.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : rev.status === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {rev.status === 'APPROVED'
                      ? 'Approved (Live on Site)'
                      : rev.status === 'REJECTED'
                      ? 'Rejected (Hidden)'
                      : 'Pending Moderation'}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {rev.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                        disabled={processingId === rev.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                        title="Approve review for public display"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    )}

                    {rev.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'REJECTED')}
                        disabled={processingId === rev.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        title="Reject review from public display"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(rev.id)}
                      disabled={processingId === rev.id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title="Permanently Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
