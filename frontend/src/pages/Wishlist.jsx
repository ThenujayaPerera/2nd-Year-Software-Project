import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../store';
import { useToast } from '../components/Toast';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const toast = useToast();

  const handleRemove = (product) => {
    toggleWishlist(product);
    if (toast) toast(`${product.name} removed from wishlist`, { type: 'info' });
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product);
    if (toast) toast(`${product.name} moved to cart!`, { type: 'success', title: 'Moved to Cart' });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <div className="mb-6 sm:mb-10">
          <span className="text-accent font-bold text-xs tracking-widest uppercase mb-1 sm:mb-2 block">Saved Items</span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-1.5 sm:mb-2">My Wishlist</h1>
          <p className="text-slate-500 text-xs sm:text-base">Items you've saved for later. Don't let them sell out!</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-8 sm:p-16 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 text-accent rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8 max-w-xs mx-auto">Browse our collection and save the ones you love.</p>
            <Link to="/products" className="btn-primary inline-flex text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="card-premium group relative flex flex-col p-3 sm:p-5">
                <button
                  onClick={() => handleRemove(item)}
                  className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-400 hover:text-red-500 transition-all"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <div className="relative overflow-hidden rounded-xl mb-3 sm:mb-4 bg-slate-100 aspect-square">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.originalPrice && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-accent text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.category}</span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5 mb-2 sm:mb-3 line-clamp-2">{item.name}</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mb-3 sm:mb-4">
                    <span className="text-sm sm:text-xl font-black text-slate-900">LKR {item.price.toLocaleString()}</span>
                    {item.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-slate-400 line-through">LKR {item.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="btn-primary w-full justify-center text-xs sm:text-sm py-2 sm:py-2.5 px-2"
                >
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Move to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
