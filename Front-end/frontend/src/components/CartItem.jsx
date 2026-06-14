import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 flex gap-6 items-center hover:shadow-md transition-all duration-300">
      {/* Product Image */}
      <img
        src={item.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop'}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-xl bg-slate-50"
      />

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 mb-0.5 truncate">{item.name}</h4>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">{item.brand || 'Generic'}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-black text-slate-900">LKR {(item.price * item.quantity).toLocaleString()}</span>
          <span className="text-xs text-slate-450 font-medium">(LKR {item.price.toLocaleString()} each)</span>
        </div>
      </div>

      {/* Quantity Control */}
      <div className="flex items-center gap-1 border border-slate-100 bg-slate-50 p-1.5 rounded-xl">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="px-3 text-sm font-bold text-slate-800">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-3 text-red-500 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

