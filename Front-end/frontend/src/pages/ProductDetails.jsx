import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCartStore } from '../store';
import { Star, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';

// Mock product database - same as Products.jsx
const MOCK_PRODUCTS = Array.from({ length: 48 }, (_, i) => {
  const category = ['Cases', 'Chargers', 'Cables', 'Protection', 'Wireless'][i % 5];
  const brand = ['Apple', 'Samsung', 'Anker', 'Spigen', 'NV-Premium', 'PowerFlow', 'ArmorShield', 'NV-Tech'][i % 8];
  const price = Math.floor(Math.random() * 150) * 100 + 1500;
  
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
    warranty: '2 Years',
    returnPeriod: '30 Days',
    description: `Premium ${category.toLowerCase()} designed for ultimate protection and compatibility. This ${brand} ${category === 'Protection' ? 'glass screen guard' : category.slice(0, -1)} offers superior quality with advanced materials and precision engineering.`,
    features: [
      'Premium Materials',
      'Easy Installation',
      'Perfect Fit',
      'Lifetime Support',
      'Eco-Friendly Packaging',
      'Quality Assured'
    ],
    specifications: [
      { label: 'Brand', value: brand },
      { label: 'Category', value: category },
      { label: 'Warranty', value: '2 Years' },
      { label: 'Return Period', value: '30 Days' },
      { label: 'Stock Status', value: 'In Stock' },
      { label: 'Shipping', value: 'Free on orders above LKR 10,000' }
    ]
  };
});

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.image || '');

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Product Not Found</h1>
          <p className="text-slate-500 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-primary inline-flex">
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity };
    addToCart(cartItem);
    setQuantity(1);
  };

  const discountedPrice = product.originalPrice
    ? product.price
    : product.price;

  const savings = product.originalPrice
    ? Math.round(product.originalPrice - product.price)
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left: Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative bg-slate-100 rounded-3xl overflow-hidden aspect-square">
              <img
                src={mainImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 bg-orange-500 text-white px-6 py-3 rounded-2xl text-lg font-black shadow-xl">
                  -{product.discount}% OFF
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-6 right-6 bg-primary text-white px-6 py-3 rounded-2xl text-lg font-black shadow-xl">
                  NEW
                </div>
              )}
            </div>

            {/* Image Gallery Thumbnails */}
            <div className="flex gap-4">
              {[product.image].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    mainImage === img
                      ? 'border-primary'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-between">
            {/* Product Header */}
            <div>
              <div className="mb-4">
                <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block font-mono">
                  {product.brand}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-slate-900">{product.rating}</span>
                <span className="text-sm text-slate-500">({product.reviews} reviews)</span>
              </div>

              {/* Price Section */}
              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-5xl font-black text-slate-900">
                    LKR {discountedPrice.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-slate-400 line-through">
                      LKR {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <p className="text-green-600 font-bold">
                    Save LKR {savings.toLocaleString()} ({product.discount}%)
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-8">
                <div className={`flex items-center gap-3 text-lg font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                      In Stock ({product.stock} available)
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full bg-red-600" />
                      Out of Stock
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-bold text-lg border-l border-r border-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock === 0}
                    className="px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full py-4 bg-primary hover:bg-primary/95 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-blue-600 rounded-full">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Fast Shipping</h3>
            </div>
            <p className="text-slate-700">Free shipping on orders above LKR 10,000</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border border-green-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-green-600 rounded-full">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">{product.warranty} Warranty</h3>
            </div>
            <p className="text-slate-700">Complete peace of mind with our warranty</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border border-purple-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-purple-600 rounded-full">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">{product.returnPeriod} Returns</h3>
            </div>
            <p className="text-slate-700">Hassle-free returns within 30 days</p>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 mb-16">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Specifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.specifications.map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="font-semibold text-slate-600">{spec.label}</span>
                <span className="font-bold text-slate-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-8">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.slice(0, 4).map((related) => (
              <Link
                key={related.id}
                to={`/product/${related.id}`}
                className="group card-premium hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative mb-4 bg-slate-100 rounded-xl overflow-hidden aspect-square">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{related.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-sm">{related.rating}</span>
                </div>
                <p className="font-black text-lg text-slate-900">LKR {related.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
