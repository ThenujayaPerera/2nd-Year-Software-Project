import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { useCartStore, useFilterStore } from '../store';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('trending');
  const addToCart = useCartStore((state) => state.addToCart);
  const filters = useFilterStore((state) => state.filters);

  const itemsPerPage = 12;

  useEffect(() => {
    // Simulate API call with filters
    setTimeout(() => {
      const mockProducts = Array.from({ length: 48 }, (_, i) => ({
        id: i + 1,
        name: `Mobile Accessory ${i + 1}`,
        price: Math.floor(Math.random() * 100) + 5,
        originalPrice: Math.floor(Math.random() * 150) + 20,
        category: ['Cases', 'Chargers', 'Cables', 'Protectors', 'Stands'][i % 5],
        brand: ['Apple', 'Samsung', 'Generic', 'Anker', 'Spigen'][i % 5],
        rating: Math.floor(Math.random() * 2) + 3,
        reviews: Math.floor(Math.random() * 300),
        image: `https://via.placeholder.com/250x200?text=Product${i + 1}`,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 40) + 10 : 0,
        isNew: Math.random() > 0.8,
        stock: Math.floor(Math.random() * 50),
      }));

      setProducts(mockProducts);
      setLoading(false);
    }, 600);
  }, [filters]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (productId) => {
    console.log('View product:', productId);
  };

  // Pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayProducts = products.slice(startIdx, startIdx + itemsPerPage);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Products</h1>
          <p className="text-gray-600">Browse our extensive collection of mobile accessories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, products.length)} of {products.length} products
                </p>
              </div>

              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field text-sm py-1"
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
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : displayProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                      className="btn-secondary disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}