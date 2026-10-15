import { ShoppingCart, Eye, Star, Heart, CheckSquare2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';
import { useComparisonStore, useWishlistStore } from '../store';

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { addToComparison, removeFromComparison, isInComparison } = useComparisonStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inComparison = isInComparison(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    onAddToCart(product);
    if (toast) toast(`${product.name} added to cart!`, { type: 'success', title: 'Added to Cart' });
  };

  const handleViewDetails = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product.id);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleToggleComparison = (e) => {
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(product.id);
      if (toast) toast(`${product.name} removed from comparison`, { type: 'info' });
    } else {
      const result = addToComparison(product);
      if (result?.reason === 'MAX_REACHED') {
        if (toast) toast('Comparison is available for a maximum of 3 items.', { type: 'warning', title: 'Limit Reached' });
      } else if (result?.success) {
        if (toast) toast(`${product.name} added to comparison!`, { type: 'success' });
      }
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (inWishlist) {
      if (toast) toast(`${product.name} removed from wishlist`, { type: 'info' });
    } else {
      if (toast) toast(`${product.name} added to wishlist!`, { type: 'success', title: 'Saved to Wishlist' });
    }
  };

  return (
    <div className="card-premium group relative flex flex-col h-full p-3 sm:p-5">
      {/* Wishlist & Comparison Buttons - Visible on mobile, hover on desktop */}
      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 flex flex-col gap-1.5 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
        <button 
          onClick={handleToggleComparison}
          className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-sm transition-all active:scale-90 ${
            inComparison
              ? 'bg-primary text-white'
              : 'bg-white/90 hover:bg-primary/10 hover:text-primary text-slate-600'
          }`}
          title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
        >
          <CheckSquare2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button 
          onClick={handleToggleWishlist}
          className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-sm transition-all active:scale-90 ${
            inWishlist
              ? 'bg-red-50 text-red-500 scale-105 shadow-md shadow-red-500/20'
              : 'bg-white/90 hover:bg-red-50 hover:text-red-500 text-slate-600'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative mb-3 sm:mb-4 bg-slate-100 rounded-xl overflow-hidden aspect-square cursor-pointer" onClick={handleViewDetails}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {(product.discount > 0 || product.isNew) && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[1] flex items-center gap-1 sm:gap-1.5">
            {product.isNew && (
              <span className="bg-primary text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-black shadow-md whitespace-nowrap">
                NEW
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-600 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-black shadow-md whitespace-nowrap">
                -{product.discount}%
              </span>
            )}
          </div>
        )}

        {/* Quick View Overlay (Desktop only) */}
        <div className="hidden sm:flex absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3">
          <button
            onClick={handleViewDetails}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-3 group-hover:translate-y-0 duration-300 shadow-lg"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1 sm:mb-1.5">
          <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-primary uppercase truncate max-w-[65%]">
            {product.category || 'Accessories'}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-700">{product.rating || '4.5'}</span>
          </div>
        </div>

        <h3 onClick={handleViewDetails} className="font-bold text-slate-900 text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer leading-tight sm:leading-snug">
          {product.name}
        </h3>

        <p className="text-[10px] sm:text-xs text-slate-400 mb-1.5 font-medium truncate">
          by {product.brand || 'Premium Brand'}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {product.isFreeDelivery || product.deliveryFee === 0 ? (
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
              Free Delivery
            </span>
          ) : (
            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
              Delivery LKR {(product.deliveryFee || 350).toLocaleString()}
            </span>
          )}
          {(product.vatRate || 0) > 0 && (
            <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded-md">
              VAT {product.vatRate}%
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:gap-3">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex flex-col min-w-0">
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through truncate">
                  LKR {product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs sm:text-base font-black text-slate-900 truncate">
                LKR {product.price.toLocaleString()}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 text-white hover:bg-primary transition-all disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 shrink-0"
              title="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Koko Installment Banner */}
          <div className="border-t border-slate-100 pt-1.5 text-[9px] sm:text-[10px] font-semibold text-slate-500 flex items-center justify-between gap-1">
            <span className="truncate">3x Koko</span>
            <span className="text-koko font-bold shrink-0">LKR {Math.round(product.price / 3).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
