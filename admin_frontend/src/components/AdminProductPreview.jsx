import React from 'react';
import { ShoppingCart, Eye, Star, Heart, CheckSquare2 } from 'lucide-react';

export default function AdminProductPreview({ product, label }) {
  // Use dummy logic for the preview
  const inComparison = false;
  const inWishlist = false;

  return (
    <div className="card-premium group relative flex flex-col h-full w-full max-w-[280px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-4 transition-all hover:shadow-hover cursor-default">
      
      {/* Label Badge */}
      {label && (
        <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full z-20 shadow-md border-2 border-white">
          {label}
        </div>
      )}

      {/* Wishlist & Comparison Buttons (Dummy) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
        <button 
          className="p-2 rounded-full backdrop-blur-md shadow-sm transition-all bg-white/80 hover:bg-primary/10 hover:text-primary"
          title="Add to comparison (Preview)"
        >
          <CheckSquare2 className="w-5 h-5" />
        </button>
        <button 
          className="p-2 rounded-full backdrop-blur-md shadow-sm transition-all bg-white/80 hover:bg-red-50 hover:text-red-500"
          title="Add to wishlist (Preview)"
        >
          <Heart className="w-5 h-5 transition-transform" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative mb-6 bg-slate-100 rounded-xl overflow-hidden aspect-square">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{product.discount}% OFF
          </div>
        )}

        {product.isNew && (
          <div className={`absolute left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg ${product.discount > 0 ? 'top-12' : 'top-4'}`}>
            NEW ARRIVAL
          </div>
        )}

        {/* Quick View Overlay (Dummy) */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
            {product.category || 'Accessories'}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-700">{product.rating || '4.5'}</span>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name || 'Product Name'}
        </h3>

        <p className="text-xs text-slate-400 mb-2 font-semibold italic">
          by {product.brand || 'Premium Brand'}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {product.isFreeDelivery || Number(product.deliveryFee) === 0 ? (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Free Delivery
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              Delivery: LKR {Number(product.deliveryFee || 0).toLocaleString()}
            </span>
          )}
          {Number(product.vatRate) > 0 && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              VAT: {product.vatRate}%
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              {product.originalPrice > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  LKR {Number(product.originalPrice).toLocaleString()}
                </span>
              )}
              <span className="text-lg font-black text-slate-900">
                LKR {Number(product.price || 0).toLocaleString()}
              </span>
            </div>
            
            <button
              disabled={product.stock === 0}
              className="p-3 rounded-xl bg-slate-900 text-white hover:bg-primary transition-all disabled:bg-slate-200 disabled:text-slate-400"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>

          {/* Koko Installment Banner */}
          <div className="border-t border-slate-100 pt-2 text-[10px] font-semibold text-slate-500 flex items-center justify-between">
            <span>Or 3 installments of</span>
            <span className="text-koko font-bold">LKR {Math.round((product.price || 0) / 3).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
