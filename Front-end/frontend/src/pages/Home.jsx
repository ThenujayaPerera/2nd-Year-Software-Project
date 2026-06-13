import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeaturedProducts([
        {
          id: 1,
          name: 'Premium Phone Case',
          price: 19.99,
          originalPrice: 29.99,
          category: 'Cases',
          rating: 5,
          reviews: 128,
          image: 'https://via.placeholder.com/250x200?text=Case',
          discount: 33,
          isNew: false,
          stock: 10,
          brand: 'OtterBox',
        },
        {
          id: 2,
          name: 'USB-C Fast Charger',
          price: 34.99,
          category: 'Chargers',
          rating: 4,
          reviews: 89,
          image: 'https://via.placeholder.com/250x200?text=Charger',
          isNew: true,
          stock: 25,
          brand: 'Anker',
        },
        {
          id: 3,
          name: 'Screen Protector Tempered Glass',
          price: 9.99,
          originalPrice: 14.99,
          category: 'Screen Protectors',
          rating: 4,
          reviews: 256,
          image: 'https://via.placeholder.com/250x200?text=Protector',
          discount: 33,
          stock: 50,
          brand: 'Spigen',
        },
        {
          id: 4,
          name: 'Wireless Charging Pad',
          price: 24.99,
          category: 'Wireless Chargers',
          rating: 5,
          reviews: 67,
          image: 'https://via.placeholder.com/250x200?text=Wireless',
          stock: 15,
          brand: 'Samsung',
        },
        {
          id: 5,
          name: 'Phone Mount Stand',
          price: 12.99,
          category: 'Stands',
          rating: 4,
          reviews: 143,
          image: 'https://via.placeholder.com/250x200?text=Stand',
          stock: 30,
        },
        {
          id: 6,
          name: '20000mAh Power Bank',
          price: 39.99,
          category: 'Power Banks',
          rating: 5,
          reviews: 201,
          image: 'https://via.placeholder.com/250x200?text=PowerBank',
          stock: 20,
          brand: 'Xiaomi',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (productId) => {
    console.log('View product:', productId);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">Premium Mobile Accessories</h1>
              <p className="text-xl mb-6 opacity-90">
                Discover our exclusive collection of high-quality accessories for all your devices.
              </p>
              <div className="flex gap-4">
                <Link to="/products" className="btn bg-white text-blue-600 hover:bg-gray-100">
                  Shop Now
                </Link>
                <Link to="#" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="text-center">
              <div className="text-9xl">📱</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-gray-600">Check out our most popular items</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Cases', emoji: '📦', count: 245 },
              { name: 'Chargers', emoji: '🔌', count: 156 },
              { name: 'Cables', emoji: '🔗', count: 89 },
              { name: 'Protectors', emoji: '🛡️', count: 178 },
              { name: 'Stands', emoji: '📱', count: 67 },
            ].map((cat) => (
              <Link
                key={cat.name}
                to="/products"
                className="card text-center hover:shadow-lg"
              >
                <div className="text-5xl mb-2">{cat.emoji}</div>
                <h3 className="font-semibold mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get 20% Off Your First Order</h2>
          <p className="text-lg mb-6 opacity-90">Subscribe to our newsletter and get exclusive deals</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <button className="btn bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}