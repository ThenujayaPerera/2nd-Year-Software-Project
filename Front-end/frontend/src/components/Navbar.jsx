import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore, useComparisonStore, useWishlistStore } from '../store';
import { ShoppingCart, User, LogOut, Search, Menu, X, ShieldCheck, Heart, Truck, Scale } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const comparison = useComparisonStore((state) => state.comparison);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const cartItemsCount = cart.length;
  const comparisonCount = comparison.length;
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 dark:bg-black text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 transition-colors duration-300">
        <Truck className="w-4 h-4 text-primary animate-pulse" />
        <span>Island-wide Delivery | Buy Original Accessories via Bank Transfer, Card & <b>Koko</b> installments!</span>
      </div>

      <nav className="bg-white/95 dark:bg-darkNav/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-darkBorder transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="NVSHOP.LK"
                className="h-10 md:h-11 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 mx-12 max-w-xl relative group">
              <button type="submit" aria-label="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-primary hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Anker, UGREEN, Baseus, Headphones, Chargers..."
                className="input-premium pl-12 pr-4"
              />
            </form>

            {/* Navigation Links */}
            <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
              <Link to="/products" className="nav-link hidden lg:block">
                Products
              </Link>
              <Link to="/about" className="nav-link hidden lg:block">
                About
              </Link>
              <Link to="/contact" className="nav-link hidden lg:block">
                Contact
              </Link>

              <div className="h-8 w-px bg-slate-200 dark:bg-darkBorder hidden md:block" />

              {/* Theme Toggle - Desktop & Tablet */}
              <div className="hidden sm:flex items-center">
                <ThemeToggle />
              </div>

              {/* Cart & Wishlist - Always Visible */}
              <Link
                to="/wishlist"
                className="p-2.5 text-slate-600 dark:text-darkMuted hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full transition-all relative"
                title="My Wishlist"
                aria-label="Wishlist"
              >
                <Heart className={`w-6 h-6 transition-transform ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-darkNav shadow-sm animate-scaleIn">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link 
                to={isAuthenticated ? "/comparison" : "/login"} 
                className="p-2.5 text-slate-600 dark:text-darkMuted hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-full transition-all relative" 
                title="Compare Products"
                aria-label="Compare Products"
              >
                <Scale className="w-6 h-6" />
                {comparisonCount > 0 && isAuthenticated && (
                  <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-darkNav">
                    {comparisonCount}
                  </span>
                )}
              </Link>

              <Link 
                to="/cart" 
                className="p-2.5 text-slate-600 dark:text-darkMuted hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-full transition-all relative"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-darkNav">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <div className="h-8 w-px bg-slate-200 dark:bg-darkBorder hidden md:block" />

              {/* Desktop User Menu / Auth Buttons */}
              <div className="hidden md:flex items-center">
                {isAuthenticated ? (
                  <div className="relative group ml-2">
                    <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 dark:border-darkBorder hover:border-primary/30 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all">
                      <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-darkText pr-2">
                        {user?.name?.split(' ')[0] || 'Account'}
                      </span>
                    </button>

                    {/* Enhanced Dropdown */}
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-darkCard rounded-2xl shadow-2xl border border-slate-100 dark:border-darkBorder opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 dark:bg-darkNav border-b border-slate-100 dark:border-darkBorder">
                        <p className="text-xs text-slate-500 dark:text-darkMuted">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-darkText truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-darkMuted hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary rounded-lg transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-darkMuted hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary rounded-lg transition-colors">
                          <ShoppingCart className="w-4 h-4" /> My Orders
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm text-primary bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg font-medium transition-colors">
                            <ShieldCheck className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <div className="my-1 border-t border-slate-100 dark:border-darkBorder" />
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
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

              {/* Mobile Header Theme Toggle & Hamburger */}
              <div className="flex sm:hidden items-center gap-1">
                <ThemeToggle />
              </div>

              {/* Mobile Hamburger Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Mobile Menu"
                className="md:hidden p-2 text-slate-700 dark:text-darkText hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-darkCard rounded-xl transition-all"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-darkBorder bg-white dark:bg-darkNav px-6 py-6 space-y-6 animate-fadeIn shadow-2xl transition-colors duration-300">
            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <button type="submit" aria-label="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500">
                <Search className="w-5 h-5" />
              </button>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input-premium pl-12 pr-4 text-sm"
              />
            </form>

            {/* Mobile Theme Toggle Pill */}
            <div className="pt-1">
              <ThemeToggle variant="pill" />
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3 font-bold text-slate-800 dark:text-darkText">
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="py-2.5 px-4 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between"
              >
                <span>Products Catalog</span>
                <span className="text-xs bg-slate-100 dark:bg-darkCard text-slate-600 dark:text-darkMuted px-2 py-0.5 rounded-full font-semibold">Browse</span>
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="py-2.5 px-4 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary transition-all"
              >
                About NVSHOP
              </Link>
              <Link
                to="/wishlist"
                onClick={closeMobileMenu}
                className="py-2.5 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-slate-500 dark:text-darkMuted'}`} />
                  <span>My Wishlist</span>
                </div>
                {wishlistCount > 0 ? (
                  <span className="text-xs bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold px-2.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-zinc-500">0 items</span>
                )}
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="py-2.5 px-4 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary transition-all"
              >
                Contact & Support
              </Link>
            </div>

            <div className="border-t border-slate-100 dark:border-darkBorder pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-darkCard rounded-2xl border border-slate-100 dark:border-darkBorder">
                    <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-base">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-900 dark:text-darkText truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-darkMuted truncate">{user?.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-slate-700 dark:text-darkText hover:bg-slate-50 dark:hover:bg-darkCard font-semibold transition-colors"
                  >
                    <User className="w-5 h-5 text-slate-400 dark:text-zinc-500" /> My Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-slate-700 dark:text-darkText hover:bg-slate-50 dark:hover:bg-darkCard font-semibold transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5 text-slate-400 dark:text-zinc-500" /> My Orders
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 py-2.5 px-4 rounded-xl bg-primary/5 dark:bg-primary/10 text-primary font-bold transition-colors"
                    >
                      <ShieldCheck className="w-5 h-5" /> Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => { logout(); closeMobileMenu(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 mt-2 text-red-600 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl font-bold transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="py-3 text-center rounded-xl font-bold bg-slate-100 dark:bg-darkCard text-slate-800 dark:text-darkText hover:bg-slate-200 dark:hover:bg-darkBorder transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="py-3 text-center rounded-xl font-bold bg-primary text-white hover:bg-blue-700 transition-colors shadow-md"
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
