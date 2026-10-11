import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { useCartStore } from '../store';
import { Smartphone, Zap, ShieldCheck, Truck, Headphones, ArrowRight, Star, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

// Showroom photos are fetched dynamically

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [showroomPhotos, setShowroomPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [highlightsRes, photosRes] = await Promise.all([
          fetch('http://localhost:8080/api/products/highlights'),
          fetch('http://localhost:8080/api/home/showroom')
        ]);
        if (highlightsRes.ok) {
          setFeaturedProducts(await highlightsRes.json());
        }
        if (photosRes.ok) {
          setShowroomPhotos(await photosRes.json());
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev === showroomPhotos.length - 1 ? 0 : prev + 1));
    }
  }, [selectedPhotoIndex, showroomPhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev === 0 ? showroomPhotos.length - 1 : prev - 1));
    }
  }, [selectedPhotoIndex, showroomPhotos.length]);

  const handleKeyDown = useCallback((e) => {
    if (selectedPhotoIndex === null) return;
    if (e.key === 'Escape') setSelectedPhotoIndex(null);
    if (e.key === 'ArrowRight') handleNextPhoto();
    if (e.key === 'ArrowLeft') handlePrevPhoto();
  }, [selectedPhotoIndex, handleNextPhoto, handlePrevPhoto]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
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
              <span className="text-primary font-bold text-sm tracking-widest uppercase">Editor's Choice</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900">Weekly Highlights</h2>
          </div>
          <Link to="/products" className="group flex items-center gap-2 font-bold text-slate-900 hover:text-primary transition-colors">
            View All Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex overflow-x-auto gap-6 pb-6 -mx-6 px-6 snap-x hide-scrollbar">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 animate-pulse snap-start">
                <div className="bg-slate-200 rounded-2xl aspect-square mb-4" />
                <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-6 -mx-6 px-6 snap-x hide-scrollbar">
            {featuredProducts.map((product) => (
              <div key={product.id} className="w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        )}
      </section>



      {/* Showroom Gallery Section - Step Inside NVSHOP.LK */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold text-xs tracking-widest uppercase mb-3 block">OUR AMBALANGODA SHOWROOM</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Step Inside NVSHOP.LK</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              A premium tech space for original chargers, power banks, gaming gear, and audio — with in-store demos and friendly advice on New Street, Ambalangoda.
            </p>
          </div>

          {/* Exact Mosaic Grid Layout matching requested order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(220px,auto)]">
            {showroomPhotos.map((photo, index) => (
              <div 
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`group relative rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-950 cursor-pointer ${photo.gridClass}`}
              >
                <img 
                  src={photo.image} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                />
                
                {/* Fullscreen view badge indicator */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                  <Maximize2 className="w-5 h-5" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-6 md:p-8 flex flex-col justify-end">
                  <span className={`text-xs font-bold ${photo.tagColor} tracking-wider uppercase mb-1`}>{photo.tag}</span>
                  <h3 className="text-xl md:text-2xl font-black text-white">{photo.title}</h3>
                  <p className="text-slate-300 text-xs mt-1.5 line-clamp-2">{photo.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Lightbox / Fullscreen Image Viewer Modal */}
      {selectedPhotoIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Top Bar - Close Button */}
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation - Prev Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Navigation - Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Main Modal Image Box */}
          <div 
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[70vh] bg-slate-900 flex items-center justify-center">
              <img
                src={showroomPhotos[selectedPhotoIndex].image}
                alt={showroomPhotos[selectedPhotoIndex].title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Photo Title & Caption matching reference design */}
            <div className="text-center mt-6 max-w-2xl px-4">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                {showroomPhotos[selectedPhotoIndex].title}
              </h3>
              <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed">
                {showroomPhotos[selectedPhotoIndex].fullDesc}
              </p>
            </div>
          </div>
        </div>
      )}

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