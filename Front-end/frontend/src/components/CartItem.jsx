import { Trash2, Plus, Minus, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProductFallbackImage } from './ProductCard';

export default function CartItem({ item, onQuantityChange, onRemove, isSelected, onSelectChange }) {
  const fallbackSrc = getProductFallbackImage(item.category, item.name);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:border-blue-400/40 hover:shadow-md transition-all">
      
      {/* Selection Checkbox */}
      {onSelectChange && (
        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={onSelectChange}
          className="w-5 h-5 accent-blue-600 rounded cursor-pointer shrink-0 mt-1 sm:mt-0"
        />
      )}

      {/* Product Image Thumbnail */}
      <Link to={`/product/${item.id}`} className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-2xl p-2 border border-slate-100 shrink-0 flex items-center justify-center overflow-hidden group">
        <img
          src={item.image || fallbackSrc}
          alt={item.name}
          onError={(e) => {
            if (e.currentTarget.src !== fallbackSrc) {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackSrc;
            }
          }}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
            {item.brand || 'NV-Genuine'}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold truncate">
            {item.category || 'Accessories'}
          </span>
        </div>

        <Link to={`/product/${item.id}`} className="font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition-colors line-clamp-2">
          {item.name}
        </Link>

        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm sm:text-base font-black text-slate-900 font-sans">
            Rs. {item.price?.toLocaleString()}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-xs text-slate-400 line-through">
              Rs. {item.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Selector Box (Exact NVSHOP Style) */}
      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden shadow-xs shrink-0">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200/60 font-bold transition-colors"
          title="Decrease"
        >
          −
        </button>
        <span className="px-3.5 py-1.5 font-bold text-slate-900 text-sm border-x border-slate-200 bg-white min-w-[36px] text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200/60 font-bold transition-colors"
          title="Increase"
        >
          +
        </button>
      </div>

      {/* Item Line Total & Delete */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
        <span className="text-base sm:text-lg font-black text-slate-900 font-sans">
          Rs. {(item.price * item.quantity).toLocaleString()}
        </span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
