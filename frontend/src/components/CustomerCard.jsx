import React from 'react';
import { User, Heart, ShoppingCart } from 'lucide-react';

export default function CustomerCard({ customer = {}, pendingCount = 0, boughtCount = 0 }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          {customer?.avatar ? (
            <img src={customer.avatar} alt={customer.name} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <User className="w-10 h-10" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900">{customer?.name || 'Customer'}</h2>
          <p className="text-sm text-slate-600">{customer?.email || 'No email provided'}</p>
          <p className="text-sm text-slate-600">{customer?.phone || 'No phone'}</p>
          <p className="text-sm text-slate-600 truncate max-w-xl">{customer?.address || 'No address'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-primary">{pendingCount}</p>
            <p className="text-xs text-slate-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-green-600">{boughtCount}</p>
            <p className="text-xs text-slate-600">Bought</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">Message</button>
        <button className="px-4 py-2 bg-slate-100 rounded-lg">Order History</button>
      </div>
    </div>
  );
}
