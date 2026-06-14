import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { useCartStore, useFilterStore } from '../store';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

// Pre-generated mock database to keep list consistent
const MOCK_PRODUCTS = Array.from({ length: 48 }, (_, i) => {
  const category = ['Cases', 'Chargers', 'Cables', 'Protection', 'Wireless'][i % 5];
  const brand = ['Apple', 'Samsung', 'Anker', 'Spigen', 'NV-Premium', 'PowerFlow', 'ArmorShield', 'NV-Tech'][i % 8];
  const price = Math.floor(Math.random() * 150) * 100 + 1500; // Prices from 1,500 to 16,500 LKR
  
  return {
    id: i + 1,
    name: `${brand} ${category === 'Protection' ? 'Glass Screen Guard' : category.slice(0, -1)} Pro`,
    price: price,
    originalPrice: Math.random() > 0.5 ? Math.floor(price * 1.3) : null,
    category: category,
    brand: brand,
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    reviews: Math.floor(Math.random() * 300) + 10,
    image: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600&auto=format&fit=crop',
    ][i % 4],
    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0,
    isNew: Math.random() > 0.8,
    stock: Math.floor(Math.random() * 15),
  };
});

export default function Products() {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('trending');
  const addToCart = useCartStore((state) => state.addToCart);
  const filters = useFilterStore((state) => state.filters);

  const itemsPerPage = 18;

  useEffect(() => {
    setLoading(true);
    // Simulate minor network delay
    const timer = setTimeout(() => {
      let result = [...MOCK_PRODUCTS];

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
        result.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'newest') {
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      }

      setFilteredProducts(result);
      setCurrentPage(1); // Reset page on filter change
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters, sortBy]);

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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <span className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-2 block">Catalog</span>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Our Premium Collection</h1>
          <p className="text-slate-500">Upgrade your tech setup with meticulously designed accessories.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Products Area */}
          <div className="lg:col-span-3">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-slate-100">
              <p className="text-sm font-semibold text-slate-500">
                Showing <span className="text-slate-900">{filteredProducts.length > 0 ? startIdx + 1 : 0}</span> to <span className="text-slate-900">{Math.min(startIdx + itemsPerPage, filteredProducts.length)}</span> of <span className="text-slate-900">{filteredProducts.length}</span> products
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-slate-50 border-none font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-100 rounded-2xl aspect-square mb-4" />
                    <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${
                          currentPage === i + 1
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ChevronRight className="w-5 h-5" />
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
