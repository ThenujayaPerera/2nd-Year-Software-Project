import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { useCartStore } from '../store';
import { Smartphone, Zap, ShieldCheck, Truck, Headphones, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    // Simulated API call with actual NVSHOP inventory in LKR
    setTimeout(() => {
      setFeaturedProducts([
        {
          id: 1,
          name: 'UGREEN Nexode 65W GaN Fast Charger',
          price: 9800,
          originalPrice: 12500,
          category: 'Chargers',
          rating: 4.9,
          reviews: 142,
          image: 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600&auto=format&fit=crop',
          discount: 21,
          isNew: true,
          stock: 12,
          brand: 'UGREEN',
        },
        {
          id: 2,
          name: 'Anker PowerLine III USB-C to USB-C Cable',
          price: 3400,
          originalPrice: 4200,
          category: 'Cables',
          rating: 4.8,
          reviews: 96,
          image: 'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600&auto=format&fit=crop',
          discount: 19,
          isNew: false,
          stock: 25,
          brand: 'Anker',
        },
        {
          id: 3,
          name: 'Baseus Adaman 20000mAh 22.5W Power Bank',
          price: 11200,
          originalPrice: 14500,
          category: 'Wireless',
          rating: 4.9,
          reviews: 84,
          image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600&auto=format&fit=crop',
          discount: 22,
          stock: 8,
          brand: 'Baseus',
        },
        {
          id: 4,
          name: 'Aspor A616 TWS Wireless Earphones',
          price: 4900,
          originalPrice: 6500,
          category: 'Audio',
          rating: 4.7,
          reviews: 53,
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop',
          discount: 24,
          isNew: true,
          stock: 15,
          brand: 'Aspor',
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (productId) => {
    console.log('View product:', productId);
  };

  return (
    <Layout>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Benefits Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over LKR 10,000' },
              { icon: ShieldCheck, title: '100% Original', desc: 'Anker, UGREEN, Baseus' },
              { icon: Headphones, title: 'Support Chat', desc: 'Fast WhatsApp support' },
              { icon: Zap, title: 'Express Delivery', desc: 'Cash on Delivery island-wide' },
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{benefit.title}</h3>
                <p className="text-xs text-slate-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-primary font-bold text-sm tracking-widest uppercase">Editor\'s Choice</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900">Weekly Highlights</h2>
          </div>
          <Link to="/products" className="group flex items-center gap-2 font-bold text-slate-900 hover:text-primary transition-colors">
            View All Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 rounded-2xl aspect-square mb-4" />
                <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Curated Categories</h2>
            <p className="text-slate-500">Find the perfect accessory for your lifestyle, designed for performance and style.</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Elite Cases', icon: Smartphone, count: 245, color: 'text-primary', bg: 'bg-primary/10' },
              { name: 'Fast Charging', icon: Zap, count: 156, color: 'text-amber-600', bg: 'bg-amber-50' },
              { name: 'Security', icon: ShieldCheck, count: 89, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { name: 'Audio Bliss', icon: Headphones, count: 178, color: 'text-accent', bg: 'bg-accent/10' },
              { name: 'Essentials', icon: Star, count: 67, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to="/products"
                className="bg-white p-8 rounded-3xl text-center border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group"
              >
                <div className={`w-16 h-16 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500 font-medium tracking-wide">{cat.count} PRODUCTS</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden p-12 md:p-20">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] -rotate-12 translate-x-1/2" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Join the NV Elite</h2>
                <p className="text-lg text-slate-400 mb-8">Get LKR 1,000 off your first order and exclusive access to new drops and tech tips.</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors">
                    Join Now
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-white/5 flex items-center justify-center">
                  <Zap className="w-32 h-32 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}