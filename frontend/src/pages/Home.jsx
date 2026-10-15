import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { useCartStore } from '../store';
import { Smartphone, Zap, ShieldCheck, Truck, Headphones, ArrowRight, Star, X, ChevronLeft, ChevronRight, Maximize2, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { useToast } from '../components/Toast';

// Showroom photos are fetched dynamically

import { officialCatalog } from '../data/officialCatalog';

const DEFAULT_SHOWROOM_PHOTOS = [
  { id: 1, tag: 'OFFICIAL HUB', tagColor: 'text-blue-400', title: 'NVSHOP.LK Reception', subtitle: '100% Genuine Tech Warranties & In-store Support', fullDesc: 'Official reception & customer service counter with illuminated branding at NVSHOP.LK Ambalangoda showroom.', image: '/store/nvshop-store.jpg', gridClass: 'col-span-1 md:col-span-2 row-span-2 h-full min-h-[420px] md:min-h-[520px]' },
  { id: 2, tag: 'MODERN AMBIENCE', tagColor: 'text-emerald-400', title: 'Showroom Lounge & Seating', subtitle: 'Comfortable consultation area under honeycomb lighting', fullDesc: 'Modern customer lounge area equipped with green accent seating and signature honeycomb ceiling lights.', image: '/store/nvshop-showroom-seating.webp', gridClass: 'col-span-1 aspect-[4/3] md:aspect-auto md:h-full min-h-[240px]' },
  { id: 3, tag: 'INTERACTIVE DEMOS', tagColor: 'text-amber-400', title: 'Live VR Experience Zone', subtitle: 'Test PS5 VR & Soundcore Pure Bass Headphones Live', fullDesc: 'Customer testing area equipped with Sony PS5 VR headset, Soundcore audio range, and gaming consoles.', image: '/store/nvshop-vr-demo.webp', gridClass: 'col-span-1 aspect-[4/3] md:aspect-auto md:h-full min-h-[240px]' },
  { id: 4, tag: 'GAMING TECH', tagColor: 'text-purple-400', title: 'VR & Gaming Setup', subtitle: 'PlayStation 5, controllers, and VR display shelves', fullDesc: 'Dedicated gaming shelf featuring PS5 consoles, dualsense controllers, VR headsets, and Soundcore audio.', image: '/store/nvshop-gaming-vr-zone.jpg', gridClass: 'col-span-1 aspect-[4/3]' },
  { id: 5, tag: 'STORE OVERVIEW', tagColor: 'text-cyan-400', title: 'Full Retail Space View', subtitle: 'Power banks, gaming gear, and consultation tables', fullDesc: 'Full high-angle view of the NVSHOP.LK retail space — original chargers, audio displays, and consultation area.', image: '/store/nvshop-store-overview.jpg', gridClass: 'col-span-1 aspect-[4/3]' },
  { id: 6, tag: 'AUDIO DISPLAY', tagColor: 'text-rose-400', title: 'Branded Audio Shelving', subtitle: 'Anker Soundcore & Sony audio display collection', fullDesc: 'Original Anker Soundcore wireless earbuds, headphones, and portable speakers organized on display shelves.', image: '/store/nvshop-audio-gaming-shelf.jpg', gridClass: 'col-span-1 aspect-[4/3]' },
  { id: 7, tag: 'FULL AISLE', tagColor: 'text-teal-400', title: 'Showroom Main Aisle', subtitle: 'Spacious aisle leading to the reception counter', fullDesc: 'Main aisle view of NVSHOP.LK showroom with wall-to-wall accessories display and signature lighting.', image: '/store/nvshop-aisle-ugreen.jpg', gridClass: 'col-span-1 aspect-[4/3]' },
  { id: 8, tag: 'INTERIOR DESIGN', tagColor: 'text-indigo-400', title: 'Tech Lounge Interior', subtitle: 'Clean wooden finishes & futuristic ceiling lights', fullDesc: 'Interior setup with wood paneling, LED accent strips, and customer consultation space.', image: '/store/nvshop-interior-branding.jpg', gridClass: 'col-span-1 aspect-[4/3]' },
  { id: 9, tag: 'SOUND SYSTEMS', tagColor: 'text-amber-400', title: 'Party Speakers & Audio Lineup', subtitle: 'Soundcore Rave, Motion+, & Sony Bluetooth speakers', fullDesc: 'High-power bluetooth partybox speakers and wireless audio lineup on display at NVSHOP.LK.', image: '/store/nvshop-speakers-display.jpg', gridClass: 'col-span-1 aspect-[4/3]' }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState(officialCatalog.slice(0, 8));
  const [showroomPhotos, setShowroomPhotos] = useState(DEFAULT_SHOWROOM_PHOTOS);
  const [loading, setLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [eliteEmail, setEliteEmail] = useState('');
  const [isEliteJoined, setIsEliteJoined] = useState(false);
  const [isEliteSubmitting, setIsEliteSubmitting] = useState(false);
  const toast = useToast();
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();

  const handleJoinElite = (e) => {
    e.preventDefault();
    if (!eliteEmail || !eliteEmail.trim()) {
      toast('Please enter a valid email address to join NV Elite.', {
        type: 'error',
        title: 'Email Required'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(eliteEmail.trim())) {
      toast('Please enter a valid email format (e.g. name@example.com).', {
        type: 'error',
        title: 'Invalid Email'
      });
      return;
    }

    setIsEliteSubmitting(true);
    setTimeout(() => {
      setIsEliteSubmitting(false);
      setIsEliteJoined(true);
      toast(
        `Thank you for joining NV Elite! We've sent a welcome confirmation email with your exclusive LKR 1,000 discount voucher code to ${eliteEmail.trim()}. Please check your inbox!`,
        {
          type: 'success',
          title: 'Thank You for Joining NV Elite! 🎉',
          duration: 6000
        }
      );
    }, 400);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [highlightsRes, photosRes] = await Promise.all([
          fetch('http://127.0.0.1:8080/api/products/highlights'),
          fetch('http://127.0.0.1:8080/api/home/showroom')
        ]);
        if (highlightsRes.ok) {
          const data = await highlightsRes.json();
          if (Array.isArray(data) && data.length > 0) setFeaturedProducts(data);
        }
        if (photosRes.ok) {
          const data = await photosRes.json();
          if (Array.isArray(data) && data.length > 0) setShowroomPhotos(data);
        }
      } catch (error) {
        // Keep initial fallback data
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
      <section className="py-8 sm:py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over LKR 10,000' },
              { icon: ShieldCheck, title: '100% Original', desc: 'Anker, UGREEN, Baseus' },
              { icon: Headphones, title: 'Support Chat', desc: 'Fast WhatsApp support' },
              { icon: Zap, title: 'Express Delivery', desc: 'Cash on Delivery island-wide' },
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-default p-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 sm:mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{benefit.title}</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-primary font-bold text-xs tracking-widest uppercase">Editor's Choice</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">Weekly Highlights</h2>
          </div>
          <Link to="/products" className="group flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900 hover:text-primary transition-colors self-start sm:self-auto">
            <span>View All Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 snap-x hide-scrollbar">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[72vw] sm:w-[280px] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 animate-pulse snap-start">
                <div className="bg-slate-200 rounded-2xl aspect-square mb-3" />
                <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 snap-x hide-scrollbar">
            {featuredProducts.map((product) => (
              <div key={product.id} className="w-[72vw] sm:w-[280px] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start">
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
      <section id="showroom" className="py-14 sm:py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-primary font-bold text-[10px] sm:text-xs tracking-widest uppercase mb-2 block">OUR AMBALANGODA SHOWROOM</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 sm:mb-4">Step Inside NVSHOP.LK</h2>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              A premium tech space for original chargers, power banks, gaming gear, and audio — with in-store demos and friendly advice on New Street, Ambalangoda.
            </p>
          </div>

          {/* Mosaic Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 auto-rows-[minmax(200px,auto)]">
            {showroomPhotos.map((photo, index) => (
              <div 
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl border border-slate-100 bg-slate-950 cursor-pointer ${photo.gridClass || ''}`}
              >
                <img 
                  src={photo.image} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100 min-h-[220px]" 
                  loading="lazy"
                />
                
                {/* Fullscreen view badge indicator */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-lg">
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent p-4 sm:p-7 flex flex-col justify-end">
                  <span className={`text-[10px] sm:text-xs font-bold ${photo.tagColor || 'text-primary'} tracking-wider uppercase mb-1`}>{photo.tag}</span>
                  <h3 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight">{photo.title}</h3>
                  <p className="text-slate-300 text-[11px] sm:text-xs mt-1 line-clamp-2">{photo.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Lightbox / Fullscreen Image Viewer Modal */}
      {selectedPhotoIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 animate-fade-in"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Top Bar - Close Button */}
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation - Prev Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          {/* Navigation - Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          {/* Main Modal Image Box */}
          <div 
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[60vh] sm:max-h-[70vh] bg-slate-900 flex items-center justify-center">
              <img
                src={showroomPhotos[selectedPhotoIndex].image}
                alt={showroomPhotos[selectedPhotoIndex].title}
                className="max-h-[60vh] sm:max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Photo Title & Caption */}
            <div className="text-center mt-4 sm:mt-6 max-w-2xl px-2">
              <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight mb-1 sm:mb-2">
                {showroomPhotos[selectedPhotoIndex].title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed line-clamp-3 sm:line-clamp-none">
                {showroomPhotos[selectedPhotoIndex].fullDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative bg-slate-900 rounded-3xl sm:rounded-[3rem] overflow-hidden p-6 sm:p-12 md:p-20">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] -rotate-12 translate-x-1/2" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-6">Join the NV Elite</h2>
                <p className="text-sm sm:text-lg text-slate-400 mb-6 sm:mb-8">Get LKR 1,000 off your first order and exclusive access to new drops and tech tips.</p>
                {isEliteJoined ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 max-w-md backdrop-blur-md animate-fade-in">
                    <div className="flex items-center gap-3 text-emerald-400 font-bold text-base sm:text-lg mb-1.5">
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                      <span>You're officially an NV Elite Member!</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Thank you for joining! We've sent your <strong className="text-white">LKR 1,000 welcome discount code</strong> and VIP perks to <strong className="text-emerald-300 underline">{eliteEmail}</strong>. Check your inbox!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleJoinElite} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        value={eliteEmail}
                        onChange={(e) => setEliteEmail(e.target.value)}
                        placeholder="Enter your email address"
                        disabled={isEliteSubmitting}
                        className="w-full pl-11 pr-4 sm:pr-6 py-3.5 sm:py-4 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isEliteSubmitting}
                      className="bg-white text-slate-900 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all active:scale-95 shrink-0 disabled:opacity-60 shadow-lg shadow-black/20 flex items-center justify-center gap-2"
                    >
                      {isEliteSubmitting ? (
                        <span>Joining...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Join Now</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
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