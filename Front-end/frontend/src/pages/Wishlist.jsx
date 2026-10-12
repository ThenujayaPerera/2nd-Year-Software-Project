import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useWishlistStore, useCartStore, useAuthStore } from '../store';
import { useToast } from '../components/Toast';
import { productAPI } from '../services/api';
import {
  Heart, ShoppingCart, Trash2, ArrowRight, Share2, Sparkles,
  Search, SlidersHorizontal, CheckCircle2, AlertCircle, Eye,
  Grid, List, Check, ArrowUpDown, Tag, Truck, ShieldCheck,
  Zap, Copy, ExternalLink, X, RefreshCw, ShoppingBag
} from 'lucide-react';

export default function Wishlist() {
  const navigate = useNavigate();
  const toast = useToast();
  const { wishlist, removeFromWishlist, moveToCart, moveAllToCart, clearWishlist, isLoading } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  // Toolbar & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // recent, price_asc, price_desc, savings, name
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Recommendations for empty state or bottom drawer
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    // Load recommendations from catalog
    productAPI.getAll()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setRecommendedProducts(res.data.slice(0, 4));
        }
      })
      .catch(() => {
        // Fallback default recommendations
        setRecommendedProducts([
          {
            id: 101,
            name: 'Anker Nano II 65W GaN Fast Charger',
            price: 11500,
            originalPrice: 13900,
            image: 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600&auto=format&fit=crop',
            category: 'Chargers',
            brand: 'Anker',
            rating: 4.9,
            stock: 8,
          },
          {
            id: 102,
            name: 'UGREEN 100W USB-C to USB-C Braided Cable 2M',
            price: 3800,
            originalPrice: 4500,
            image: 'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600&auto=format&fit=crop',
            category: 'Cables',
            brand: 'UGREEN',
            rating: 4.8,
            stock: 25,
          },
          {
            id: 103,
            name: 'Baseus Bowie H1i Noise Cancelling Headphones',
            price: 19800,
            originalPrice: 24500,
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop',
            category: 'Wireless',
            brand: 'Baseus',
            rating: 4.7,
            stock: 6,
          },
          {
            id: 104,
            name: 'Spigen Ultra Hybrid MagFit Case for iPhone 16 Pro',
            price: 8900,
            originalPrice: 10500,
            image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop',
            category: 'Cases',
            brand: 'Spigen',
            rating: 4.9,
            stock: 12,
          },
        ]);
      });
  }, []);

  // Compute available categories from wishlist items
  const categories = useMemo(() => {
    const set = new Set();
    wishlist.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [wishlist]);

  // Filtered and sorted wishlist items
  const filteredWishlist = useMemo(() => {
    let result = [...wishlist];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // In-stock filter
    if (inStockOnly) {
      result = result.filter((item) => item.stock === undefined || item.stock > 0);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'savings') {
        const savingsA = (a.originalPrice || a.price) - a.price;
        const savingsB = (b.originalPrice || b.price) - b.price;
        return savingsB - savingsA;
      }
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      // default 'recent'
      const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
      const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [wishlist, searchQuery, selectedCategory, inStockOnly, sortBy]);

  // Aggregate stats
  const totalValue = useMemo(() => {
    return wishlist.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  }, [wishlist]);

  const totalSavings = useMemo(() => {
    return wishlist.reduce((acc, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return acc + (item.originalPrice - item.price);
      }
      return acc;
    }, 0);
  }, [wishlist]);

  const inStockCount = useMemo(() => {
    return wishlist.filter((item) => item.stock === undefined || item.stock > 0).length;
  }, [wishlist]);

  // Handlers
  const handleRemove = (product) => {
    removeFromWishlist(product.id);
    if (toast) {
      toast(`${product.name} removed from your wishlist.`, {
        type: 'info',
        title: 'Item Removed',
      });
    }
  };

  const handleMoveToCart = (product) => {
    moveToCart(product);
    if (toast) {
      toast(`${product.name} moved to your shopping cart!`, {
        type: 'success',
        title: 'Added to Cart',
      });
    }
  };

  const handleMoveAllToCart = () => {
    if (inStockCount === 0) {
      if (toast) {
        toast('None of the saved items are currently in stock.', {
          type: 'error',
          title: 'Out of Stock',
        });
      }
      return;
    }
    const count = moveAllToCart();
    if (toast) {
      toast(`Moved ${count} item${count > 1 ? 's' : ''} to your shopping cart!`, {
        type: 'success',
        title: 'All Items Moved',
      });
    }
  };

  const handleClearAll = () => {
    clearWishlist();
    setIsClearModalOpen(false);
    if (toast) {
      toast('Your wishlist has been cleared.', {
        type: 'info',
        title: 'Wishlist Cleared',
      });
    }
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
    if (toast) {
      toast('Wishlist link copied to clipboard!', {
        type: 'success',
        title: 'Link Copied',
      });
    }
  };

  return (
    <Layout>
      <div className="bg-slate-50/70 dark:bg-darkBg min-h-screen py-8 sm:py-12 px-4 sm:px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-darkMuted font-medium">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-darkText font-bold">My Wishlist</span>
          </div>

          {/* Header Banner */}
          <div className="bg-white dark:bg-darkCard rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-darkBorder shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-12 top-6 hidden lg:block opacity-10">
              <Heart className="w-48 h-48 text-red-500 fill-red-500" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/60 rounded-full text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Heart className="w-3.5 h-3.5 fill-red-600 dark:fill-red-400" />
                  Saved Tech Items
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-darkText tracking-tight">
                  My Wishlist
                </h1>
                <p className="text-slate-500 dark:text-darkMuted text-sm mt-1 max-w-xl">
                  Keep track of premium chargers, wireless gear, cases and audio products you love. Don't let them sell out!
                </p>
              </div>

              {/* Action Buttons in Header */}
              {wishlist.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="btn-secondary text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
                    title="Share your wishlist"
                  >
                    <Share2 className="w-4 h-4 text-slate-600 dark:text-darkText" />
                    Share List
                  </button>

                  <button
                    onClick={handleMoveAllToCart}
                    disabled={inStockCount === 0}
                    className="btn-primary text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Move All In-Stock ({inStockCount})
                  </button>

                  <button
                    onClick={() => setIsClearModalOpen(true)}
                    className="p-2.5 text-slate-400 dark:text-darkMuted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                    title="Clear wishlist"
                    aria-label="Clear wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Guest Banner Notice */}
            {!isAuthenticated && wishlist.length > 0 && (
              <div className="mt-6 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-darkNav dark:to-darkNav border border-blue-200/80 dark:border-darkBorder rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-300">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>
                    <b>Browsing as Guest:</b> Items are saved in this browser. Log in to sync across your smartphone, laptop, and tablet.
                  </span>
                </div>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-xl transition-all text-center shrink-0 shadow-sm"
                >
                  Sign In to Sync
                </Link>
              </div>
            )}
          </div>

          {/* Aggregate Stats Ribbon (Only if items exist) */}
          {wishlist.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-darkCard p-5 rounded-2xl border border-slate-200/80 dark:border-darkBorder shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 fill-red-500" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-darkMuted uppercase tracking-wider">Total Saved</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-darkText">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-darkCard p-5 rounded-2xl border border-slate-200/80 dark:border-darkBorder shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-darkMuted uppercase tracking-wider">Estimated Value</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-darkText">Rs. {totalValue.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-darkCard p-5 rounded-2xl border border-slate-200/80 dark:border-darkBorder shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-darkMuted uppercase tracking-wider">Stock Status</p>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{inStockCount} / {wishlist.length} in stock</p>
                </div>
              </div>

              <div className="bg-white dark:bg-darkCard p-5 rounded-2xl border border-slate-200/80 dark:border-darkBorder shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 fill-amber-500" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-darkMuted uppercase tracking-wider">Potential Savings</p>
                  <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                    {totalSavings > 0 ? `Rs. ${totalSavings.toLocaleString()}` : 'Best Prices'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Wishlist Section */}
          {wishlist.length === 0 ? (
            /* EMPTY STATE WITH CURATED RECOMMENDATIONS */
            <div className="space-y-12">
              <div className="bg-white dark:bg-darkCard rounded-3xl border border-slate-200/80 dark:border-darkBorder p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-24 h-24 bg-gradient-to-tr from-red-100 to-pink-50 dark:from-red-950/40 dark:to-pink-950/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Heart className="w-12 h-12 fill-red-500 animate-pulse" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-darkText mb-3">
                  Your Wishlist is Empty
                </h2>
                <p className="text-slate-500 dark:text-darkMuted text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  You haven't saved any products yet. Browse our selection of genuine chargers, cables, earbuds, and accessories, and tap the heart icon to save items.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/products"
                    className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3 shadow-lg shadow-primary/20"
                  >
                    <ShoppingBag className="w-4 h-4" /> Explore Catalog
                  </Link>
                  <Link
                    to="/products?category=Chargers"
                    className="btn-secondary inline-flex items-center gap-2 text-sm px-5 py-3"
                  >
                    View Top Chargers
                  </Link>
                </div>
              </div>

              {/* Recommended Products Carousel / Grid */}
              {recommendedProducts.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-darkText flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Popular Tech Accessories
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-darkMuted">Add these customer favorites directly to your wishlist or cart</p>
                    </div>
                    <Link to="/products" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      View all products <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedProducts.map((product) => (
                      <div key={product.id} className="card-premium group relative flex flex-col justify-between">
                        <div>
                          <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-100 dark:bg-darkNav aspect-square">
                            <img
                              src={product.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                            {product.category || 'Accessories'}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-darkText text-sm mt-1 mb-2 line-clamp-2">
                            {product.name}
                          </h4>
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-base font-black text-slate-900 dark:text-darkText">
                              Rs. {product.price?.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-slate-400 dark:text-darkMuted line-through">
                                Rs. {product.originalPrice?.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-darkBorder">
                          <button
                            onClick={() => {
                              useWishlistStore.getState().addToWishlist(product);
                              if (toast) {
                                toast(`${product.name} saved to wishlist!`, { type: 'success' });
                              }
                            }}
                            className="flex-1 py-2 px-3 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Heart className="w-3.5 h-3.5 fill-red-600 dark:fill-red-400" /> Wishlist
                          </button>
                          <button
                            onClick={() => {
                              addToCart(product);
                              if (toast) {
                                toast(`${product.name} added to cart!`, { type: 'success' });
                              }
                            }}
                            className="p-2 bg-slate-900 dark:bg-slate-800 hover:bg-primary text-white rounded-xl transition-colors"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ACTIVE WISHLIST VIEW WITH CONTROLS AND CARDS */
            <div className="space-y-6">

              {/* Toolbar Controls */}
              <div className="bg-white dark:bg-darkCard rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-darkBorder shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                {/* Left: Search input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 dark:text-darkMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter saved items by name or brand..."
                    className="w-full pl-10 pr-9 py-2 bg-slate-100 hover:bg-slate-200/60 dark:bg-darkNav dark:hover:bg-darkNav/80 focus:bg-white dark:focus:bg-darkBg text-slate-900 dark:text-darkText border border-transparent dark:border-darkBorder rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-darkMuted"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-darkMuted hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Middle: Category Pills */}
                {categories.length > 2 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedCategory === cat
                            ? 'bg-slate-900 dark:bg-primary text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-darkNav text-slate-600 dark:text-darkMuted hover:bg-slate-200/70 dark:hover:bg-darkBg'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Right: In-stock toggle, Sorting dropdown & View layout mode */}
                <div className="flex items-center gap-3 self-end lg:self-auto">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-darkMuted cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    In-Stock Only
                  </label>

                  <div className="h-6 w-px bg-slate-200 dark:bg-darkBorder" />

                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-darkMuted">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-darkMuted" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-100 dark:bg-darkNav text-slate-900 dark:text-darkText hover:bg-slate-200/70 dark:hover:bg-darkBg border border-transparent dark:border-darkBorder rounded-xl text-xs font-bold px-2.5 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="recent">Recently Added</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="savings">Biggest Savings</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>

                  <div className="h-6 w-px bg-slate-200 dark:bg-darkBorder hidden sm:block" />

                  {/* Grid vs List toggle */}
                  <div className="hidden sm:flex items-center bg-slate-100 dark:bg-darkNav rounded-xl p-0.5 border border-transparent dark:border-darkBorder">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-darkCard text-slate-900 dark:text-darkText shadow-sm' : 'text-slate-400 dark:text-darkMuted hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-darkCard text-slate-900 dark:text-darkText shadow-sm' : 'text-slate-400 dark:text-darkMuted hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* If search/filter returns zero results */}
              {filteredWishlist.length === 0 ? (
                <div className="bg-white dark:bg-darkCard rounded-3xl border border-slate-200/80 dark:border-darkBorder p-12 text-center max-w-lg mx-auto">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-darkText mb-1">No items match your filter</h3>
                  <p className="text-xs text-slate-500 dark:text-darkMuted mb-4">
                    Try clearing your search query or toggling off the in-stock filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ALL');
                      setInStockOnly(false);
                    }}
                    className="btn-secondary text-xs px-4 py-2 inline-flex"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredWishlist.map((item) => {
                    const isOutOfStock = item.stock !== undefined && item.stock <= 0;
                    const isLowStock = item.stock !== undefined && item.stock > 0 && item.stock <= 5;

                    return (
                      <div key={item.id} className="card-premium group relative flex flex-col justify-between h-full bg-white dark:bg-darkCard border border-slate-200/80 dark:border-darkBorder">

                        {/* Top Badges & Action Buttons */}
                        <div className="relative">
                          <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-100 dark:bg-darkNav aspect-square">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop'}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                              onClick={() => navigate(`/product/${item.id}`)}
                            />

                            {/* Discount Tag */}
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                              </span>
                            )}

                            {/* Top Right Quick Actions: Quick View & Remove */}
                            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                              <button
                                onClick={() => setQuickViewProduct(item)}
                                className="p-2 bg-white/90 dark:bg-darkCard/90 hover:bg-white dark:hover:bg-darkCard text-slate-700 dark:text-darkText hover:text-primary rounded-full shadow-md backdrop-blur-sm transition-all"
                                title="Quick View"
                                aria-label="Quick View"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleRemove(item)}
                                className="p-2 bg-white/90 dark:bg-darkCard/90 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 rounded-full shadow-md backdrop-blur-sm transition-all"
                                title="Remove from Wishlist"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Stock Indicator Pill Over Image */}
                            <div className="absolute bottom-3 left-3 z-10">
                              {isOutOfStock ? (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                                  Out of Stock
                                </span>
                              ) : isLowStock ? (
                                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                                  Only {item.stock} Left
                                </span>
                              ) : (
                                <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> In Stock
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Brand & Category */}
                          <div className="flex items-center justify-between gap-2 mb-1 text-[11px] font-semibold text-slate-400 dark:text-darkMuted">
                            <span className="uppercase tracking-wider">{item.category || 'Accessories'}</span>
                            {item.brand && <span className="text-slate-600 dark:text-darkText font-bold">{item.brand}</span>}
                          </div>

                          {/* Title */}
                          <Link
                            to={`/product/${item.id}`}
                            className="font-bold text-slate-900 dark:text-darkText text-sm line-clamp-2 hover:text-primary dark:hover:text-primary transition-colors block mb-2"
                          >
                            {item.name}
                          </Link>
                        </div>

                        {/* Price & Cart Actions */}
                        <div className="pt-3 border-t border-slate-100 dark:border-darkBorder space-y-3">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-black text-slate-900 dark:text-darkText">
                                Rs. {item.price?.toLocaleString()}
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-slate-400 dark:text-darkMuted line-through">
                                  Rs. {item.originalPrice?.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Koko 3x Installment Callout */}
                            <p className="text-[10px] font-semibold text-slate-500 dark:text-darkMuted mt-0.5">
                              Or 3x <span className="text-[#00d1b2] font-bold">Rs. {Math.round(item.price / 3).toLocaleString()}</span> with Koko
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleMoveToCart(item)}
                              disabled={isOutOfStock}
                              className="btn-primary w-full justify-center text-xs py-2.5 rounded-xl shadow-md disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:shadow-none"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              {isOutOfStock ? 'Sold Out' : 'Move to Cart'}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="space-y-4">
                  {filteredWishlist.map((item) => {
                    const isOutOfStock = item.stock !== undefined && item.stock <= 0;
                    const isLowStock = item.stock !== undefined && item.stock > 0 && item.stock <= 5;

                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-darkCard rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-darkBorder shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-5"
                      >
                        {/* Left: Thumbnail & Details */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 dark:bg-darkNav overflow-hidden shrink-0 cursor-pointer relative group"
                          >
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop'}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                {item.category || 'Accessories'}
                              </span>
                              {item.brand && (
                                <span className="text-[10px] font-semibold text-slate-500 dark:text-darkMuted">
                                  by {item.brand}
                                </span>
                              )}
                            </div>

                            <Link
                              to={`/product/${item.id}`}
                              className="font-bold text-slate-900 dark:text-darkText text-sm hover:text-primary dark:hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>

                            <div className="flex items-center gap-2">
                              {isOutOfStock ? (
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                                  Out of Stock
                                </span>
                              ) : isLowStock ? (
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                                  Only {item.stock} Remaining
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Price & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-darkBorder">
                          <div className="text-left sm:text-right">
                            <div className="flex items-baseline sm:justify-end gap-2">
                              <span className="text-lg font-black text-slate-900 dark:text-darkText">
                                Rs. {item.price?.toLocaleString()}
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-slate-400 dark:text-darkMuted line-through">
                                  Rs. {item.originalPrice?.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-darkMuted block">
                              3x Rs. {Math.round(item.price / 3).toLocaleString()} Koko
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQuickViewProduct(item)}
                              className="p-2.5 rounded-xl border border-slate-200 dark:border-darkBorder text-slate-600 dark:text-darkText hover:text-primary hover:border-primary/30 transition-all"
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleMoveToCart(item)}
                              disabled={isOutOfStock}
                              className="btn-primary text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-40"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Move to Cart
                            </button>

                            <button
                              onClick={() => handleRemove(item)}
                              className="p-2.5 text-slate-400 dark:text-darkMuted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* NVSHOP Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-white dark:bg-darkCard p-5 rounded-2xl border border-slate-200/80 dark:border-darkBorder shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-darkNav text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-darkText text-xs">Island-wide Fast Delivery</h5>
                <p className="text-[11px] text-slate-500 dark:text-darkMuted">Prompt 24-48h dispatch across Sri Lanka</p>
              </div>
            </div>

            <div className="bg-white dark:bg-darkCard p-5 rounded-2xl border border-slate-200/80 dark:border-darkBorder shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-darkNav text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-darkText text-xs">100% Genuine Guarantee</h5>
                <p className="text-[11px] text-slate-500 dark:text-darkMuted">Official brand warranties with invoices</p>
              </div>
            </div>

            <div className="bg-white dark:bg-darkCard p-5 rounded-2xl border border-slate-200/80 dark:border-darkBorder shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-darkNav text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-darkText text-xs">Flexible Payment Options</h5>
                <p className="text-[11px] text-slate-500 dark:text-darkMuted">Bank transfer, card, and 3x Koko installments</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-darkCard rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-darkBorder relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 dark:text-darkMuted hover:text-slate-700 dark:hover:text-darkText hover:bg-slate-100 dark:hover:bg-darkNav transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-slate-100 dark:bg-darkNav rounded-2xl aspect-square overflow-hidden">
                <img
                  src={quickViewProduct.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop'}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {quickViewProduct.category} • {quickViewProduct.brand}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-darkText mt-1">
                    {quickViewProduct.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-darkText">
                    Rs. {quickViewProduct.price?.toLocaleString()}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-sm text-slate-400 dark:text-darkMuted line-through">
                      Rs. {quickViewProduct.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-darkNav rounded-xl border border-slate-100 dark:border-darkBorder text-xs text-slate-600 dark:text-darkMuted space-y-1">
                  <p><b className="text-slate-900 dark:text-darkText">Availability:</b> {quickViewProduct.stock > 0 ? 'In Stock (Fast Dispatch)' : 'Out of Stock'}</p>
                  <p><b className="text-slate-900 dark:text-darkText">Warranty:</b> 1 Year Official Brand Warranty</p>
                  <p><b className="text-slate-900 dark:text-darkText">Delivery:</b> 1 - 3 business days island-wide</p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleMoveToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    disabled={quickViewProduct.stock <= 0}
                    className="btn-primary w-full justify-center text-xs py-3 rounded-xl shadow-md disabled:opacity-40"
                  >
                    <ShoppingCart className="w-4 h-4" /> Move to Shopping Cart
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/product/${quickViewProduct.id}`);
                      setQuickViewProduct(null);
                    }}
                    className="btn-secondary w-full justify-center text-xs py-2.5 rounded-xl"
                  >
                    View Complete Details <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE WISHLIST MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-darkCard rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-darkBorder relative">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 dark:text-darkMuted hover:text-slate-700 dark:hover:text-darkText hover:bg-slate-100 dark:hover:bg-darkNav transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-darkText">Share Your Wishlist</h3>
              <p className="text-xs text-slate-500 dark:text-darkMuted mt-1">
                Share your saved gadgets with friends or save the link for later.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-darkNav rounded-2xl border border-slate-200/80 dark:border-darkBorder">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="bg-transparent text-xs text-slate-700 dark:text-darkText px-2 flex-1 outline-none font-mono"
                />
                <button
                  onClick={handleCopyShareLink}
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-darkNav rounded-2xl border border-slate-100 dark:border-darkBorder text-xs text-slate-600 dark:text-darkMuted">
                <p className="font-bold text-slate-800 dark:text-darkText mb-1">Items in this list ({wishlist.length}):</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500 dark:text-darkMuted max-h-32 overflow-y-auto">
                  {wishlist.map((item) => (
                    <li key={item.id} className="truncate">
                      {item.name} — Rs. {item.price?.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my tech wishlist on NVSHOP: ${window.location.href}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                Share via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL CONFIRMATION MODAL */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-darkCard rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 dark:border-darkBorder relative">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-darkText mb-2">Clear Wishlist?</h3>
            <p className="text-xs text-slate-500 dark:text-darkMuted mb-6 leading-relaxed">
              Are you sure you want to remove all {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} from your wishlist? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="btn-secondary flex-1 text-xs py-2.5 rounded-xl justify-center"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex-1 transition-all shadow-md shadow-red-500/20"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
