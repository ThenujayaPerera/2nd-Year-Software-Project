import React from 'react';
import { User, Heart, ShoppingCart } from 'lucide-react';

export default function CustomerCard({ customer = {}, pendingCount = 0, boughtCount = 0 }) {
  return (
    <div className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-slate-100 dark:border-darkBorder p-6 mb-8 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-slate-100 dark:bg-darkNav rounded-full flex items-center justify-center text-slate-400 dark:text-darkMuted border border-transparent dark:border-darkBorder">
          {customer?.avatar ? (
            <img src={customer.avatar} alt={customer.name} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <User className="w-10 h-10" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-darkText">{customer?.name || 'Customer'}</h2>
          <p className="text-sm text-slate-600 dark:text-darkMuted">{customer?.email || 'No email provided'}</p>
          <p className="text-sm text-slate-600 dark:text-darkMuted">{customer?.phone || 'No phone'}</p>
          <p className="text-sm text-slate-600 dark:text-darkMuted truncate max-w-xl">{customer?.address || 'No address'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-primary">{pendingCount}</p>
            <p className="text-xs text-slate-600 dark:text-darkMuted">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-green-600 dark:text-emerald-400">{boughtCount}</p>
            <p className="text-xs text-slate-600 dark:text-darkMuted">Bought</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors">Message</button>
        <button className="px-4 py-2 bg-slate-100 dark:bg-darkNav text-slate-800 dark:text-darkText hover:bg-slate-200 dark:hover:bg-[#252525] rounded-lg transition-colors border border-transparent dark:border-darkBorder">Order History</button>
      </div>
    </div>
  );
}
