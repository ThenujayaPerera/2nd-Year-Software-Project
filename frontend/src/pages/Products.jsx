import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { useCartStore, useFilterStore } from '../store';
import { productAPI } from '../services/api';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

import { officialCatalog } from '../data/officialCatalog';

// Official database fallback
const MOCK_PRODUCTS = officialCatalog;


export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('trending');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const filters = useFilterStore((state) => state.filters);

  const itemsPerPage = 18;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchPromise = searchQuery
      ? productAPI.getAll({ q: searchQuery })
      : productAPI.getAll();

    fetchPromise
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setProducts(res.data);
        } else if (isMounted) {
          setProducts(MOCK_PRODUCTS);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts(MOCK_PRODUCTS);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [searchQuery]);

  useEffect(() => {
    let result = products.length > 0 ? [...products] : [...MOCK_PRODUCTS];

    // Apply Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Apply Filters
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.brand) {
      result = result.filter(p => p.brand === filters.brand);
    }
    if (filters.inStock) {
      result = result.filter(p => p.stock > 0);
    }
    if (filters.rating > 0) {
      result = result.filter(p => p.rating >= filters.rating);
    }
    // Price range matches LKR values
    result = result.filter(p => p.price <= filters.priceRange[1]);

    // Apply Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, filters, sortBy, searchQuery]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayProducts = filteredProducts.slice(startIdx, startIdx + itemsPerPage);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <div className="mb-6 sm:mb-12">
          <span className="text-blue-600 font-bold text-[10px] sm:text-xs tracking-widest uppercase mb-1 sm:mb-2 block">Catalog</span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-1 sm:mb-2">Our Premium Collection</h1>
          <p className="text-slate-500 text-xs sm:text-base">Upgrade your tech setup with meticulously designed accessories.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
          {/* Desktop Sidebar (hidden on mobile, visible on lg) */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>

          {/* Mobile Filter Drawer Modal */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in" onClick={() => setIsMobileFilterOpen(false)}>
              <div 
                className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 shadow-2xl animate-slide-in"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar onClose={() => setIsMobileFilterOpen(false)} />
              </div>
            </div>
          )}

          {/* Main Catalog View */}
          <div className="lg:col-span-3">
            {searchQuery && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
                <p className="text-xs sm:text-sm font-bold text-blue-900 truncate mr-2">
                  Search results for <span className="underline font-black">"{searchQuery}"</span>
                </p>
                <button 
                  onClick={() => navigate('/products')} 
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors shrink-0"
                >
                  Clear ✕
                </button>
              </div>
            )}

            {/* Header Controls: Mobile Filter Button & Sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 sm:mb-8 gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                  Showing <span className="text-slate-900 font-bold">{filteredProducts.length > 0 ? startIdx + 1 : 0}</span> to <span className="text-slate-900 font-bold">{Math.min(startIdx + itemsPerPage, filteredProducts.length)}</span> of <span className="text-slate-900 font-bold">{filteredProducts.length}</span>
                </p>

                {/* Mobile Filter Trigger Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-blue-100 active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {(filters.category || filters.brand || filters.inStock || filters.rating > 0) && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="trending">Trending</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white p-3 rounded-2xl border border-slate-100">
                    <div className="bg-slate-100 rounded-xl aspect-square mb-3" />
                    <div className="h-3.5 bg-slate-100 rounded w-2/3 mb-2" />
                    <div className="h-3.5 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <>
                {/* 2-Column Responsive Grid on Mobile, 3 on Desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                  {displayProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 sm:p-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                          currentPage === i + 1
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 sm:p-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <SlidersHorizontal className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
                <p className="text-sm text-slate-400">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
