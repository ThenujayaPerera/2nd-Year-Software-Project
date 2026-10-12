import { ShoppingCart, Eye, Star, Heart, CheckSquare2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';
import { useComparisonStore, useWishlistStore } from '../store';

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const navigate = useNavigate();
  const toast = useToast();

  // Comparison Store
  const {
    addToComparison,
    removeFromComparison,
    isInComparison
  } = useComparisonStore();

  // Wishlist Store
  const wishlist = useWishlistStore((state) => state.wishlist);
  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist
  );

  const inComparison = isInComparison(product.id);

  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

  const handleAddToCart = () => {
    onAddToCart(product);

    if (toast) {
      toast(
        `${product.name} added to cart!`,
        {
          type: 'success',
          title: 'Added to Cart'
        }
      );
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);

    if (onViewDetails) {
      onViewDetails(product.id);
    }
  };

  const handleToggleComparison = () => {
    if (inComparison) {
      removeFromComparison(product.id);

      if (toast) {
        toast(
          'Removed from comparison',
          { type: 'info' }
        );
      }
    } else {
      addToComparison(product);

      if (toast) {
        toast(
          'Added to comparison!',
          { type: 'success' }
        );
      }
    }
  };

  // Wishlist handler
  const handleToggleWishlist = (e) => {
    e.stopPropagation();

    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand,
      image: product.image,
      rating: product.rating,
      stock: product.stock,
      discount: product.discount,
    });

    if (toast) {
      toast(
        isWishlisted
          ? `${product.name} removed from wishlist`
          : `${product.name} added to your wishlist!`,
        {
          type: isWishlisted ? 'info' : 'success',
          title: isWishlisted
            ? 'Removed from Wishlist'
            : 'Saved to Wishlist'
        }
      );
    }
  };

  return (
    <div className="card-premium group relative flex flex-col h-full">

      {/* Wishlist & Comparison Buttons */}
      <div className={`absolute top-4 right-4 z-10 flex flex-col gap-2 transition-all duration-200 ${isWishlisted || inComparison ? 'opacity-100' : 'opacity-90 sm:opacity-0 sm:group-hover:opacity-100'
        }`}>

        {/* Comparison Button */}
        <button
          type="button"
          onClick={handleToggleComparison}
          className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all ${inComparison
              ? 'bg-primary text-white shadow-md'
              : 'bg-white/90 dark:bg-darkCard/90 hover:bg-primary/10 hover:text-primary text-slate-600 dark:text-darkMuted border border-transparent dark:border-darkBorder'
            }`}
          title={
            inComparison
              ? 'Remove from comparison'
              : 'Add to comparison'
          }
        >
          <CheckSquare2 className="w-5 h-5" />
        </button>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 transform active:scale-90 ${isWishlisted
              ? 'bg-red-500 text-white shadow-md shadow-red-500/30 scale-105'
              : 'bg-white/90 dark:bg-darkCard/90 text-slate-600 dark:text-darkMuted hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 hover:scale-105 shadow-sm border border-transparent dark:border-darkBorder'
            }`}
          title={
            isWishlisted
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
          aria-label={
            isWishlisted
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
        >
          <Heart
            className={`w-5 h-5 transition-transform duration-300 ${isWishlisted ? 'scale-110' : ''
              }`}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

      </div>

      {/* Image Container */}
      <div
        className="relative mb-6 bg-slate-100 dark:bg-darkNav/80 rounded-xl overflow-hidden aspect-square cursor-pointer border border-transparent dark:border-darkBorder/50"
        onClick={handleViewDetails}
      >
        <img
          src={
            product.image ||
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop'
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
        <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="w-12 h-12 rounded-full bg-white dark:bg-darkCard flex items-center justify-center text-slate-900 dark:text-darkText hover:bg-primary dark:hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 border border-transparent dark:border-darkBorder"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={product.stock === 0}
            className="w-12 h-12 rounded-full bg-white dark:bg-darkCard flex items-center justify-center text-slate-900 dark:text-darkText hover:bg-primary dark:hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 disabled:opacity-50 border border-transparent dark:border-darkBorder"
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

            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {product.rating || '4.5'}
            </span>
          </div>

        </div>

        <h3
          onClick={handleViewDetails}
          className="font-bold text-slate-900 dark:text-darkText mb-1 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
        >
          {product.name}
        </h3>

        <p className="text-xs text-slate-550 mb-3 font-semibold italic text-slate-400 dark:text-darkMuted">
          by {product.brand || 'Premium Brand'}
        </p>

        <div className="mt-auto flex flex-col gap-3">

          <div className="flex items-baseline justify-between">

            <div className="flex flex-col">

              {product.originalPrice && (
                <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                  LKR {product.originalPrice.toLocaleString()}
                </span>
              )}

              <span className="text-lg font-black text-slate-900 dark:text-darkText">
                LKR {product.price.toLocaleString()}
              </span>

            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-3 rounded-xl bg-slate-900 dark:bg-primary text-white hover:bg-primary dark:hover:bg-primary/90 transition-all disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>

          </div>

          {/* Koko Installment Banner */}
          <div className="border-t border-slate-100 dark:border-darkBorder pt-2 text-[10px] font-semibold text-slate-500 dark:text-darkMuted flex items-center justify-between">
            <span>Or 3 installments of</span>

            <span className="text-koko font-bold">
              LKR {Math.round(product.price / 3).toLocaleString()}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}