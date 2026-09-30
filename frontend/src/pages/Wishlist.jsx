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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <span className="text-accent font-bold text-xs tracking-widest uppercase mb-2 block">Saved Items</span>
          <h1 className="text-4xl font-black text-slate-900 mb-2">My Wishlist</h1>
          <p className="text-slate-500">Items you've saved for later. Don't let them sell out!</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Browse our collection and save the ones you love.</p>
            <Link to="/products" className="btn-primary inline-flex">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="card-premium group relative flex flex-col">
                <button
                  onClick={() => handleRemove(item)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-100 aspect-square">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.originalPrice && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-bold text-slate-900 mt-1 mb-3 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-black text-slate-900">LKR {item.price.toLocaleString()}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">LKR {item.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="btn-primary w-full justify-center text-sm"
                >
                  <ShoppingCart className="w-4 h-4" /> Move to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
