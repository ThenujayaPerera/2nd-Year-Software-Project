import { Link } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <span className="text-3xl">📱</span>
            <span>NV-SHOP</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 mx-8 max-w-md">
            <input
              type="search"
              placeholder="Search accessories..."
              className="input-field text-sm"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative">
                  <span className="text-2xl">🛒</span>
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>

                <div className="relative group">
                  <button className="text-gray-700 hover:text-blue-600 font-medium">
                    👤 {user?.name || 'Account'}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-left hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-left hover:bg-gray-100">
                      My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-left hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
