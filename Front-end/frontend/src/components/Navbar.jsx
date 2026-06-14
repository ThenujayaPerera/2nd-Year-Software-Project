import { Link } from 'react-router-dom';
import { useAuthStore, useCartStore, useComparisonStore } from '../store';
import { ShoppingCart, User, LogOut, Search, Menu, Smartphone, ShieldCheck, Heart, Truck, Scale } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const comparison = useComparisonStore((state) => state.comparison);
  const cartItemsCount = cart.length;
  const comparisonCount = comparison.length;

  return (
    <div className="sticky top-0 z-50">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Truck className="w-4 h-4 text-primary animate-pulse" />
        <span>Island-wide Delivery | Buy Original Accessories via Bank Transfer, Card & <b>Koko</b> installments!</span>
      </div>

      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                NV<span className="text-primary">SHOP</span>
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 mx-12 max-w-xl relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="search"
                placeholder="Search Anker, UGREEN, Baseus..."
                className="input-premium pl-12"
              />
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-2 md:gap-6">
              <Link to="/products" className="nav-link hidden lg:block">
                Products
              </Link>
              <Link to="/about" className="nav-link hidden lg:block">
                About
              </Link>
              <Link to="/contact" className="nav-link hidden lg:block">
                Contact
              </Link>

              <div className="h-8 w-px bg-slate-200 hidden md:block" />

              {/* Cart & Wishlist - Always Visible */}
              <Link to="/wishlist" className={`p-2.5 ${isAuthenticated ? 'text-slate-600 hover:text-accent hover:bg-accent/5' : 'text-slate-400 cursor-not-allowed'} rounded-full transition-all relative`} onClick={(e) => !isAuthenticated && e.preventDefault()}>
                <Heart className="w-6 h-6" />
              </Link>

              <Link to={isAuthenticated ? "/comparison" : "/login"} className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative" title="Compare Products">
                <Scale className="w-6 h-6" />
                {comparisonCount > 0 && isAuthenticated && (
                  <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {comparisonCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="p-2.5 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-full transition-all relative">
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <div className="h-8 w-px bg-slate-200 hidden md:block" />

              {isAuthenticated ? (
                <>
                  <div className="relative group ml-2">
                    <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 pr-2 hidden md:block">
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
                          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm text-primary bg-primary/5 hover:bg-primary/10 rounded-lg font-medium">
                            <ShieldCheck className="w-4 h-4" /> Admin Panel
                          </Link>
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
                </>
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
              
              <button className="md:hidden p-2 text-slate-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

