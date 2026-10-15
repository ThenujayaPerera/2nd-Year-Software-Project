import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore, useComparisonStore, useWishlistStore } from '../store';
import { ShoppingCart, User, LogOut, Search, Menu, X, ShieldCheck, Heart, Truck, Scale } from 'lucide-react';
import { productAPI } from '../services/api';
import { officialCatalog } from '../data/officialCatalog';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const comparison = useComparisonStore((state) => state.comparison);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const cartItemsCount = cart.length;
  const comparisonCount = comparison.length;
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      setSuggestionsError(false);
      return undefined;
    }

    setSuggestions([]);
    setSuggestionsLoading(true);
    setSuggestionsError(false);

    let isCurrentQuery = true;
    const timer = window.setTimeout(() => {
      productAPI.search(query)
        .then(({ data }) => {
          if (isCurrentQuery) {
            setSuggestions(Array.isArray(data) ? data.slice(0, 6) : []);
          }
        })
        .catch(() => {
          if (isCurrentQuery) {
            const normalizedQuery = query.toLowerCase();
            const matches = officialCatalog.filter((product) =>
              [product.name, product.brand, product.category]
                .some((value) => value?.toLowerCase().includes(normalizedQuery))
            );
            setSuggestions(matches.slice(0, 6));
            setSuggestionsError(true);
          }
        })
        .finally(() => {
          if (isCurrentQuery) {
            setSuggestionsLoading(false);
          }
        });
    }, 250);

    return () => {
      isCurrentQuery = false;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSuggestionSelect = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setSuggestionsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const renderSuggestions = () => {
    if (!suggestionsOpen || searchQuery.trim().length < 2) return null;

    return (
      <div className="absolute left-0 right-0 top-full z-[60] mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
        {suggestionsError && (
          <p className="px-4 py-2 text-[11px] text-amber-700">
            Showing saved catalog matches; live search is unavailable.
          </p>
        )}
        {suggestionsLoading && suggestions.length === 0 && (
          <p className="px-4 py-3 text-sm text-slate-500">Searching products...</p>
        )}
        {!suggestionsLoading && suggestions.length === 0 && (
          <p className="px-4 py-3 text-sm text-slate-500">No matching products found.</p>
        )}
        {suggestions.map((product) => (
          <button
            key={product.id}
            type="button"
            role="option"
            aria-selected="false"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSuggestionSelect(product.id)}
            className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-slate-50"
          >
            <img
              src={product.image || '/logo.png'}
              alt=""
              className="h-11 w-11 shrink-0 rounded-lg bg-slate-100 object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-800">{product.name}</span>
              <span className="block truncate text-xs text-slate-500">{product.brand} · {product.category}</span>
            </span>
            {product.price != null && (
              <span className="shrink-0 text-xs font-bold text-slate-700">
                LKR {Number(product.price).toLocaleString()}
              </span>
            )}
          </button>
        ))}
        {suggestions.length > 0 && (
          <button
            type="submit"
            className="mt-1 w-full border-t border-slate-100 px-4 py-2.5 text-left text-xs font-bold text-primary hover:bg-primary/5"
          >
            View all results for “{searchQuery.trim()}”
          </button>
        )}
      </div>
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSuggestionsOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-center font-medium tracking-wide flex items-center justify-center gap-1.5 sm:gap-2">
        <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0 animate-pulse" />
        <span className="line-clamp-1 sm:line-clamp-none">Island-wide Delivery | Original Accessories | Bank Transfer, Card & <b>Koko</b></span>
      </div>

      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <img 
                src="/logo.png" 
                alt="NVSHOP.LK" 
                className="h-8 sm:h-9 md:h-11 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
            </Link>

            {/* Desktop Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 mx-8 lg:mx-12 max-w-xl relative group">
              <button type="submit" aria-label="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSuggestionsOpen(true);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 150)}
                placeholder="Search Anker, UGREEN, Baseus, Headphones, Chargers..."
                className="input-premium pl-12 pr-4 text-sm"
              />
              {renderSuggestions()}
            </form>

            {/* Navigation Links */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-6">
              <Link to="/products" className="nav-link hidden lg:block text-sm">
                Products
              </Link>
              <Link to="/about" className="nav-link hidden lg:block text-sm">
                About
              </Link>
              <Link to="/contact" className="nav-link hidden lg:block text-sm">
                Contact
              </Link>

              <div className="h-8 w-px bg-slate-200 hidden md:block" />

              {/* Cart & Wishlist - Always Visible with Mobile Optimized Hit Targets */}
              <Link to="/wishlist" className="p-2 sm:p-2.5 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all relative" title="Saved Wishlist">
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${wishlistCount > 0 ? 'text-red-500 fill-red-500/20' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-white shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to={isAuthenticated ? "/comparison" : "/login"} className="p-2 sm:p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative" title="Compare Products">
                <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
                {comparisonCount > 0 && isAuthenticated && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-blue-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-white">
                    {comparisonCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="p-2 sm:p-2.5 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-full transition-all relative" title="Cart">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-primary text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <div className="h-8 w-px bg-slate-200 hidden md:block" />

              {/* Desktop User Menu / Auth Buttons */}
              <div className="hidden md:flex items-center">
                {isAuthenticated ? (
                  <div className="relative group ml-2">
                    <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 pr-2">
                        {user?.name?.split(' ')[0] || 'Account'}
                      </span>
                    </button>
                    
                    {/* Enhanced Dropdown */}
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-primary/5 hover:text-primary rounded-lg">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-primary/5 hover:text-primary rounded-lg">
                          <ShoppingCart className="w-4 h-4" /> My Orders
                        </Link>
                        {user?.role === 'admin' && (
                          <a 
                            href={`http://${typeof window !== 'undefined' ? (window.location.hostname || 'localhost') : 'localhost'}:5174`} 
                            className="flex items-center gap-3 px-3 py-2 text-sm text-primary bg-primary/5 hover:bg-primary/10 rounded-lg font-medium"
                          >
                            <ShieldCheck className="w-4 h-4" /> Admin Panel
                          </a>
                        )}
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="btn-ghost text-sm px-4">
                      Log in
                    </Link>
                    <Link to="/signup" className="btn-primary text-sm px-6">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Hamburger Toggle Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                aria-label="Toggle Mobile Menu"
                className="md:hidden p-2 text-slate-700 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-lg px-4 py-5 space-y-5 animate-fade-in shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <button type="submit" aria-label="Search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </button>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSuggestionsOpen(true);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 150)}
                placeholder="Search chargers, power banks, audio..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
              />
              {renderSuggestions()}
            </form>

            {/* Quick Links Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link 
                to="/products" 
                onClick={closeMobileMenu}
                className="p-3 rounded-xl bg-slate-50 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between border border-slate-100"
              >
                <span>All Products</span>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">Browse</span>
              </Link>
              <Link 
                to="/wishlist" 
                onClick={closeMobileMenu}
                className="p-3 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-between border border-slate-100"
              >
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500" /> Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">{wishlistCount}</span>
                )}
              </Link>
              <Link 
                to={isAuthenticated ? "/comparison" : "/login"} 
                onClick={closeMobileMenu}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-between border border-slate-100"
              >
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-600" /> Compare
                </span>
                {comparisonCount > 0 && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{comparisonCount}</span>
                )}
              </Link>
              <Link 
                to="/cart" 
                onClick={closeMobileMenu}
                className="p-3 rounded-xl bg-slate-50 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between border border-slate-100"
              >
                <span className="flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-primary" /> Cart
                </span>
                {cartItemsCount > 0 && (
                  <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full">{cartItemsCount}</span>
                )}
              </Link>
            </div>

            {/* Informational Links */}
            <div className="flex flex-col space-y-1.5 font-bold text-xs text-slate-700 border-t border-slate-100 pt-3">
              <Link 
                to="/about" 
                onClick={closeMobileMenu}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-primary transition-all"
              >
                About NVSHOP & Ambalangoda Showroom
              </Link>
              <Link 
                to="/contact" 
                onClick={closeMobileMenu}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-primary transition-all"
              >
                Contact & Customer Hotline
              </Link>
              <Link 
                to="/shipping-info" 
                onClick={closeMobileMenu}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-primary transition-all"
              >
                Island-wide Shipping & COD
              </Link>
            </div>

            <div className="border-t border-slate-100 pt-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shrink-0">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to="/profile" 
                      onClick={closeMobileMenu} 
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                    >
                      <User className="w-4 h-4 text-slate-500" /> My Profile
                    </Link>

                    <Link 
                      to="/orders" 
                      onClick={closeMobileMenu} 
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                    >
                      <ShoppingCart className="w-4 h-4 text-slate-500" /> My Orders
                    </Link>
                  </div>

                  {user?.role === 'admin' && (
                    <a 
                      href={`http://${typeof window !== 'undefined' ? (window.location.hostname || 'localhost') : 'localhost'}:5174`} 
                      onClick={closeMobileMenu} 
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-primary/10 text-primary font-bold text-xs"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin Panel
                    </a>
                  )}

                  <button
                    onClick={() => { logout(); closeMobileMenu(); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 mt-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold text-xs transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link 
                    to="/login" 
                    onClick={closeMobileMenu}
                    className="py-2.5 text-center rounded-xl font-bold text-xs bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={closeMobileMenu}
                    className="py-2.5 text-center rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
