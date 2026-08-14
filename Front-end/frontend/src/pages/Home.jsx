import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { useCartStore } from '../store';
import { Smartphone, Zap, ShieldCheck, Truck, Headphones, ArrowRight, Star, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const SHOWROOM_PHOTOS = [
  {
    id: 1,
    tag: 'OFFICIAL HUB',
    tagColor: 'text-blue-400',
    title: 'NVSHOP.LK Reception',
    subtitle: '100% Genuine Tech Warranties & In-store Support',
    fullDesc: 'Official reception & customer service counter with illuminated branding at NVSHOP.LK Ambalangoda showroom.',
    image: '/store/nvshop-store.jpg',
    gridClass: 'col-span-1 md:col-span-2 row-span-2 h-full min-h-[420px] md:min-h-[520px]',
  },
  {
    id: 2,
    tag: 'MODERN AMBIENCE',
    tagColor: 'text-emerald-400',
    title: 'Showroom Lounge & Seating',
    subtitle: 'Comfortable consultation area under honeycomb lighting',
    fullDesc: 'Modern customer lounge area equipped with green accent seating and signature honeycomb ceiling lights.',
    image: '/store/nvshop-showroom-seating.webp',
    gridClass: 'col-span-1 aspect-[4/3] md:aspect-auto md:h-full min-h-[240px]',
  },
  {
    id: 3,
    tag: 'INTERACTIVE DEMOS',
    tagColor: 'text-amber-400',
    title: 'Live VR Experience Zone',
    subtitle: 'Test PS5 VR & Soundcore Pure Bass Headphones Live',
    fullDesc: 'Customer testing area equipped with Sony PS5 VR headset, Soundcore audio range, and gaming consoles.',
    image: '/store/nvshop-vr-demo.webp',
    gridClass: 'col-span-1 aspect-[4/3] md:aspect-auto md:h-full min-h-[240px]',
  },
  {
    id: 4,
    tag: 'GAMING TECH',
    tagColor: 'text-purple-400',
    title: 'VR & Gaming Setup',
    subtitle: 'PlayStation 5, controllers, and VR display shelves',
    fullDesc: 'Dedicated gaming shelf featuring PS5 consoles, dualsense controllers, VR headsets, and Soundcore audio.',
    image: '/store/nvshop-gaming-vr-zone.jpg',
    gridClass: 'col-span-1 aspect-[4/3]',
  },
  {
    id: 5,
    tag: 'STORE OVERVIEW',
    tagColor: 'text-cyan-400',
    title: 'Full Retail Space View',
    subtitle: 'Power banks, gaming gear, and consultation tables',
    fullDesc: 'Full high-angle view of the NVSHOP.LK retail space — original chargers, audio displays, and consultation area.',
    image: '/store/nvshop-store-overview.jpg',
    gridClass: 'col-span-1 aspect-[4/3]',
  },
  {
    id: 6,
    tag: 'AUDIO DISPLAY',
    tagColor: 'text-rose-400',
    title: 'Branded Audio Shelving',
    subtitle: 'Anker Soundcore & Sony audio display collection',
    fullDesc: 'Original Anker Soundcore wireless earbuds, headphones, and portable speakers organized on display shelves.',
    image: '/store/nvshop-audio-gaming-shelf.jpg',
    gridClass: 'col-span-1 aspect-[4/3]',
  },
  {
    id: 7,
    tag: 'FULL AISLE',
    tagColor: 'text-teal-400',
    title: 'Showroom Main Aisle',
    subtitle: 'Spacious aisle leading to the reception counter',
    fullDesc: 'Main aisle view of NVSHOP.LK showroom with wall-to-wall accessories display and signature lighting.',
    image: '/store/nvshop-aisle-ugreen.jpg',
    gridClass: 'col-span-1 aspect-[4/3]',
  },
  {
    id: 8,
    tag: 'INTERIOR DESIGN',
    tagColor: 'text-indigo-400',
    title: 'Tech Lounge Interior',
    subtitle: 'Clean wooden finishes & futuristic ceiling lights',
    fullDesc: 'Interior setup with wood paneling, LED accent strips, and customer consultation space.',
    image: '/store/nvshop-interior-branding.jpg',
    gridClass: 'col-span-1 aspect-[4/3]',
  },
  {
    id: 9,
    tag: 'SOUND SYSTEMS',
    tagColor: 'text-amber-400',
    title: 'Party Speakers & Audio Lineup',
    subtitle: 'Soundcore Rave, Motion+, & Sony Bluetooth speakers',
    fullDesc: 'High-power bluetooth partybox speakers and wireless audio lineup on display at NVSHOP.LK.',
    image: '/store/nvshop-speakers-display.jpg',
    gridClass: 'col-span-1 aspect-[4/3]',
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
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

  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev === SHOWROOM_PHOTOS.length - 1 ? 0 : prev + 1));
    }
  }, [selectedPhotoIndex]);

  const handlePrevPhoto = useCallback(() => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev === 0 ? SHOWROOM_PHOTOS.length - 1 : prev - 1));
    }
  }, [selectedPhotoIndex]);

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
    console.log('View product:', productId);
  };

  return (
    <Layout>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Benefits Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over LKR 10,000' },
              { icon: ShieldCheck, title: '100% Original', desc: 'Anker, UGREEN, Baseus' },
              { icon: Headphones, title: 'Support Chat', desc: 'Fast WhatsApp support' },
              { icon: Zap, title: 'Express Delivery', desc: 'Cash on Delivery island-wide' },
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{benefit.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{benefit.desc}</p>
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
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">Weekly Highlights</h2>
          </div>
          <Link to="/products" className="group flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors">
            View All Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl aspect-square mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
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

      {/* Showroom Gallery Section - Step Inside NVSHOP.LK */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold text-xs tracking-widest uppercase mb-3 block">OUR AMBALANGODA SHOWROOM</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Step Inside NVSHOP.LK</h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              A premium tech space for original chargers, power banks, gaming gear, and audio — with in-store demos and friendly advice on New Street, Ambalangoda.
            </p>
          </div>

          {/* Exact Mosaic Grid Layout matching requested order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(220px,auto)]">
            {SHOWROOM_PHOTOS.map((photo, index) => (
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
                src={SHOWROOM_PHOTOS[selectedPhotoIndex].image}
                alt={SHOWROOM_PHOTOS[selectedPhotoIndex].title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Photo Title & Caption matching reference design */}
            <div className="text-center mt-6 max-w-2xl px-4">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                {SHOWROOM_PHOTOS[selectedPhotoIndex].title}
              </h3>
              <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed">
                {SHOWROOM_PHOTOS[selectedPhotoIndex].fullDesc}
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