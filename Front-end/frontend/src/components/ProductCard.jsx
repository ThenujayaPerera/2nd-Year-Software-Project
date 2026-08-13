import { ShoppingCart, Eye, Star, Heart, CheckSquare2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';
import { useComparisonStore } from '../store';

export const getProductFallbackImage = (category = '', name = '') => {
  const cat = ((category || '') + ' ' + (name || '')).toLowerCase();
  if (cat.includes('watch') || cat.includes('shark') || cat.includes('ridge') || cat.includes('haylou') || cat.includes('gravix')) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('power bank') || cat.includes('battery') || cat.includes('mah')) {
    return 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('earphone') || cat.includes('headset') || cat.includes('earbud') || cat.includes('soundcore') || cat.includes('airpod') || cat.includes('liberty')) {
    return 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('speaker') || cat.includes('partybox') || cat.includes('jbl') || cat.includes('sound')) {
    return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('charger') || cat.includes('adapter') || cat.includes('cable') || cat.includes('gan') || cat.includes('nexode')) {
    return 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('case') || cat.includes('cover') || cat.includes('hybrid') || cat.includes('armor')) {
    return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('glass') || cat.includes('protector') || cat.includes('guard') || cat.includes('screen')) {
    return 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('mouse') || cat.includes('keyboard') || cat.includes('logitech')) {
    return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('phone') || cat.includes('iphone') || cat.includes('apple') || cat.includes('16') || cat.includes('17')) {
    return 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('stand') || cat.includes('desk') || cat.includes('holder')) {
    return 'https://images.unsplash.com/photo-1586953101226-996522c06170?w=600&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80';
};

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { addToComparison, removeFromComparison, isInComparison } = useComparisonStore();
  const inComparison = isInComparison(product.id);

  const handleAddToCart = () => {
    onAddToCart(product);
    if (toast) toast(`${product.name} added to cart!`, { type: 'success', title: 'Added to Cart' });
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
    if (onViewDetails) onViewDetails(product.id);
  };

  const handleToggleComparison = () => {
    if (inComparison) {
      removeFromComparison(product.id);
      if (toast) toast(`Removed from comparison`, { type: 'info' });
    } else {
      addToComparison(product);
      if (toast) toast(`Added to comparison!`, { type: 'success' });
    }
  };

  const fallbackSrc = getProductFallbackImage(product.category, product.name);

  return (
    <div className="card-premium group relative flex flex-col h-full">
      {/* Wishlist & Comparison Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
        <button 
          onClick={handleToggleComparison}
          className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all ${
            inComparison
              ? 'bg-primary text-white'
              : 'bg-white/80 hover:bg-primary/10 hover:text-primary'
          }`}
          title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
        >
          <CheckSquare2 className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:bg-red-50 hover:text-red-500 transition-all">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative mb-6 bg-slate-100 rounded-xl overflow-hidden aspect-square cursor-pointer" onClick={handleViewDetails}>
        <img
          src={product.image || fallbackSrc}
          alt={product.name}
          onError={(e) => {
            if (e.currentTarget.src !== fallbackSrc) {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackSrc;
            }
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {product.discount && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{product.discount}% OFF
          </div>
        )}

        {product.isNew && (
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            NEW ARRIVAL
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={handleViewDetails}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 disabled:opacity-50"
          >
            <ShoppingCart className="w-5 h-5" />
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

        <h3 onClick={handleViewDetails} className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
          {product.name}
        </h3>

        <p className="text-xs text-slate-550 mb-3 font-semibold italic text-slate-400">
          by {product.brand || 'Premium Brand'}
        </p>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  LKR {product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-lg font-black text-slate-900">
                LKR {product.price.toLocaleString()}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-3 rounded-xl bg-slate-900 text-white hover:bg-primary transition-all disabled:bg-slate-200 disabled:text-slate-400"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>

          {/* Koko Installment Banner */}
          <div className="border-t border-slate-100 pt-2 text-[10px] font-semibold text-slate-500 flex items-center justify-between">
            <span>Or 3 installments of</span>
            <span className="text-koko font-bold">LKR {Math.round(product.price / 3).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

