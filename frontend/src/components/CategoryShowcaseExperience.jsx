import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ShieldCheck, Zap, ArrowRight, ShoppingCart, 
  Check, Star, Eye, ChevronRight, Play, Award, Flame, Heart
} from 'lucide-react';
import { useCartStore, useWishlistStore } from '../store';

export const SHOWCASE_CATEGORIES = [
  {
    id: 'Apple iPhone',
    title: 'Apple iPhone Series',
    badge: '100% GENUINE APPLE',
    tagline: 'Titanium Design • A18 Pro Chip • 48MP Fusion Camera',
    description: 'Experience pure innovation with Apple iPhone 16 Pro Max, iPhone 15 & genuine MagSafe ecosystems backed by 1 Year Apple Care Warranty.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-slate-900 via-blue-950 to-slate-900',
    themeColor: 'text-blue-400',
    bgBadge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Display', value: '120Hz ProMotion' },
      { label: 'Warranty', value: '1 Year Apple' },
      { label: 'Stock Status', value: 'In Showroom' },
    ],
  },
  {
    id: 'Earphones & Headsets',
    title: 'Earphones & Studio Headsets',
    badge: 'HI-RES WIRELESS AUDIO',
    tagline: 'LDAC Lossless • 50dB Hybrid ANC • 65H Long Battery',
    description: 'Immerse in studio acoustics with Anker Soundcore Space One, Liberty 4 NC, and Sony wireless headphones with crystal active noise cancellation.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-indigo-950 via-purple-950 to-slate-950',
    themeColor: 'text-purple-400',
    bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'ANC Tech', value: '50dB Hybrid' },
      { label: 'Battery', value: 'Up to 65 Hours' },
      { label: 'Audio Codec', value: 'LDAC Hi-Res' },
    ],
  },
  {
    id: 'Power Banks',
    title: 'High-Power Fast Power Banks',
    badge: '140W PD 3.1 ULTRA CHARGE',
    tagline: '24,000mAh • Dual Laptop Fast Charge • Smart Digital Display',
    description: 'Never run out of power on the go. Anker 737, UGREEN 145W, and Baseus power banks power your MacBook, iPhone, and Android devices in minutes.',
    image: 'https://images.unsplash.com/photo-1609592424368-29219e24ffb0?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-amber-950 via-orange-950 to-slate-950',
    themeColor: 'text-amber-400',
    bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Max Output', value: '140W PD 3.1' },
      { label: 'Capacity', value: 'Up to 30,000mAh' },
      { label: 'Protection', value: 'MultiProtect Safe' },
    ],
  },
  {
    id: 'Speakers',
    title: 'Bluetooth Party & Hi-Fi Speakers',
    badge: 'IP67 WATERPROOF & 360° BASS',
    tagline: 'Titanium Drivers • PartyCast 2.0 • 24-Hour Non-stop Beat',
    description: 'Fill any room or outdoor gathering with thunderous bass and crystal highs using Soundcore Motion+, Rave Neo, and JBL portable waterproof speakers.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-emerald-950 via-teal-950 to-slate-950',
    themeColor: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Waterproof', value: 'IP67 Certified' },
      { label: 'Playtime', value: '24 Hours' },
      { label: 'Sync Tech', value: 'PartyCast 100+' },
    ],
  },
  {
    id: 'Chargers & Cables & Adapters',
    title: 'GaN III Fast Chargers & Cables',
    badge: '65W - 100W GaN FAST TECH',
    tagline: 'Multi-Port USB-C • Braided Durability • 0 to 60% in 25 Mins',
    description: 'Compact Gallium Nitride (GaN) fast wall chargers and heavy-duty 240W braided Type-C to Lightning cables from UGREEN, Anker, and Baseus.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-blue-950 via-cyan-950 to-slate-950',
    themeColor: 'text-cyan-400',
    bgBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Technology', value: 'GaN III Pro' },
      { label: 'Ports', value: 'Dual/Triple USB-C' },
      { label: 'Speed', value: '3X Faster' },
    ],
  },
  {
    id: 'Phone Cases & Back Covers',
    title: 'Shockproof Cases & Back Covers',
    badge: 'MILITARY GRADE DROP TESTED',
    tagline: 'Spigen Air Cushion • Strong MagSafe Ring • Anti-Yellowing Clear',
    description: 'Ultimate drop defense meets slim aesthetic. Genuine Spigen, Youngkit, and NV-Armor cases engineered with air cushion shock absorption.',
    image: 'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-rose-950 via-red-950 to-slate-950',
    themeColor: 'text-rose-400',
    bgBadge: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Drop Test', value: 'Military Standard' },
      { label: 'MagSafe', value: 'N52 Strong Magnets' },
      { label: 'Clarity', value: 'UV Anti-Yellow' },
    ],
  },
  {
    id: 'Screen Protectors',
    title: '9H Diamond Screen Protectors',
    badge: 'AUTO-ALIGN INSTALLATION',
    tagline: 'Edge-to-Edge 9H Tempered • Privacy Anti-Peep • Anti-Fingerprint',
    description: 'Crystal clarity and maximum impact shield. Spigen EZ-Fit and privacy tempered guards with bubble-free auto-alignment installation kit.',
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-slate-900 via-teal-950 to-slate-950',
    themeColor: 'text-teal-400',
    bgBadge: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Hardness', value: '9H Diamond Grade' },
      { label: 'Oleophobic', value: 'Smudge Free' },
      { label: 'Fitting', value: 'EZ Alignment Tray' },
    ],
  },
  {
    id: 'Smart Watches',
    title: 'AMOLED Calling Smart Watches',
    badge: 'AMOLED DISPLAY & BT CALLING',
    tagline: 'Heart & SpO2 Monitor • 100+ Sports Modes • Zinc Alloy Body',
    description: 'Black Shark S1 Pro, Green Lion, and Kieslect smartwatches with vibrant always-on AMOLED displays, wireless calling, and fitness tracking.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-violet-950 via-indigo-950 to-slate-950',
    themeColor: 'text-violet-400',
    bgBadge: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Screen', value: '1.43" AMOLED 60Hz' },
      { label: 'Battery', value: 'Up to 15 Days' },
      { label: 'Calling', value: 'ENC Microphone' },
    ],
  },
  {
    id: 'Mouse & Keyboards',
    title: 'Wireless Gaming & Office Peripherals',
    badge: 'PRECISION ERGONOMIC TECH',
    tagline: '8000 DPI Darkfield • Quiet Click • Tri-Mode Bluetooth & 2.4G',
    description: 'Master your workflow and gaming with Logitech MX Master series, wireless mechanical RGB keyboards, and high-precision mice.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-zinc-950 via-slate-900 to-zinc-950',
    themeColor: 'text-sky-400',
    bgBadge: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Sensor', value: '8K Darkfield' },
      { label: 'Connectivity', value: 'BT + 2.4G Wireless' },
      { label: 'Keys', value: 'Tactile Silent' },
    ],
  },
  {
    id: 'Pendrives & SD Cards',
    title: 'High-Speed Memory & SD Cards',
    badge: 'UP TO 200MB/S 4K RECORDING',
    tagline: 'A2 V30 Speed • Shock & Temperature Proof • SanDisk & Kingston',
    description: 'Instant data transfer and reliable 4K video recording with genuine SanDisk Extreme Pro MicroSD cards and high-speed OTG USB pendrives.',
    image: 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-red-950 via-zinc-900 to-slate-950',
    themeColor: 'text-red-400',
    bgBadge: 'bg-red-500/20 text-red-300 border-red-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Read Speed', value: '200 MB/s' },
      { label: 'Video Class', value: 'V30 4K UHD' },
      { label: 'Durability', value: 'Water & X-Ray Safe' },
    ],
  },
  {
    id: 'Others',
    title: 'Car Mounts & Premium Accessories',
    badge: 'SMART LIFESTYLE TECH',
    tagline: 'Auto-Clamping MagSafe • VR Gear • Premium Desk Gadgets',
    description: 'Discover smart lifestyle accessories, high-speed car chargers, 15W wireless dashboard mounts, and genuine replacement parts.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=900&auto=format&fit=crop',
    accentColor: 'from-slate-950 via-neutral-900 to-slate-950',
    themeColor: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=200&auto=format&fit=crop',
    stats: [
      { label: 'Mounting', value: '15W Fast MagSafe' },
      { label: 'Material', value: 'Aviation Aluminum' },
      { label: 'Warranty', value: '6 Months NV Care' },
    ],
  },
];

export default function CategoryShowcaseExperience({ initialCategory = 'Apple iPhone', onCategorySelect }) {
  const [selectedId, setSelectedId] = useState(initialCategory);
  const [allProducts, setAllProducts] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const selectedCategory = SHOWCASE_CATEGORIES.find((c) => c.id === selectedId) || SHOWCASE_CATEGORIES[0];

  useEffect(() => {
    // Fetch live products from backend to show matching real inventory
    fetch('http://localhost:8080/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllProducts(data);
      })
      .catch((err) => console.warn('Showcase products fetch fallback:', err));
  }, []);

  const handleSelect = (catId) => {
    if (catId === selectedId) return;
    setIsTransitioning(true);
    setSelectedId(catId);
    if (onCategorySelect) {
      onCategorySelect(catId);
    }
    setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
  };

  // Filter products matching current active category
  const matchingProducts = allProducts.filter((p) => {
    if (!p.category) return false;
    const catLower = p.category.toLowerCase();
    const selLower = selectedCategory.id.toLowerCase();
    return catLower === selLower || catLower.includes(selLower.split(' ')[0]) || selLower.includes(catLower.split(' ')[0]);
  });

  return (
    <section className="py-8 bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Header Tag */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-blue-400">
              Interactive Category Experience (ONEi Inspired)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Click any category below to experience live cinematic previews & specs
          </p>
        </div>

        {/* 1. Horizontal Category Selector Bar (Exact ONEi Style) */}
        <div className="relative mb-8">
          <div className="flex gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x">
            {SHOWCASE_CATEGORIES.map((cat) => {
              const isSelected = selectedId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat.id)}
                  className={`snap-start flex flex-col items-center justify-between p-3 min-w-[125px] sm:min-w-[140px] rounded-2xl border transition-all duration-300 group text-center shrink-0 ${
                    isSelected
                      ? 'bg-slate-800 border-blue-500 shadow-lg shadow-blue-500/20 scale-105 ring-2 ring-blue-500/40'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850 hover:scale-[1.02]'
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-950 p-1.5 flex items-center justify-center overflow-hidden mb-2 relative">
                    <img
                      src={cat.thumbnail}
                      alt={cat.title}
                      className={`w-full h-full object-cover rounded-lg transition-transform duration-500 ${
                        isSelected ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-bold line-clamp-2 leading-tight transition-colors ${
                    isSelected ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {cat.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Cinematic Showcase Hero Stage (Video / Animated Photo Backdrop) */}
        <div
          className={`relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r ${selectedCategory.accentColor} p-6 sm:p-10 transition-opacity duration-300 min-h-[380px] flex flex-col justify-between ${
            isTransitioning ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'
          }`}
        >
          {/* Background Ambient Glow & Photo Layer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={selectedCategory.image}
              alt={selectedCategory.title}
              className="absolute right-0 top-0 w-full sm:w-2/3 h-full object-cover object-center opacity-30 mix-blend-luminosity filter blur-[0.5px] scale-105 transform hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl pointer-events-none" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border backdrop-blur-md shadow-sm">
              <span className={selectedCategory.bgBadge}>{selectedCategory.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {selectedCategory.title}
            </h2>

            <p className={`text-sm sm:text-base font-semibold ${selectedCategory.themeColor}`}>
              {selectedCategory.tagline}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
              {selectedCategory.description}
            </p>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              {selectedCategory.stats.map((st, idx) => (
                <div key={idx} className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{st.label}</span>
                  <span className="text-xs sm:text-sm font-black text-white mt-0.5 block">{st.value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-3">
              <button
                onClick={() => navigate(`/products?q=${encodeURIComponent(selectedCategory.id)}`)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                Browse All in {selectedCategory.id} <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/94769890079"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                Ask Showroom Stock (WhatsApp)
              </a>
            </div>
          </div>
        </div>

        {/* 3. Live Matching Products Grid */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Featured {selectedCategory.id} in Stock ({matchingProducts.length})
              </h3>
              <p className="text-xs text-slate-400">Direct genuine showroom inventory available for instant dispatch in Ambalangoda</p>
            </div>
            <Link
              to={`/products?q=${encodeURIComponent(selectedCategory.id)}`}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {matchingProducts.length === 0 ? (
            <div className="bg-slate-900/60 rounded-3xl p-8 text-center border border-slate-800">
              <p className="text-slate-400 text-sm">Loading official {selectedCategory.id} inventory...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {matchingProducts.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500/50 hover:bg-slate-850 transition-all duration-300 group"
                >
                  <div className="relative aspect-square rounded-xl bg-slate-950 p-2 overflow-hidden mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full">
                      {product.brand || 'Genuine'}
                    </span>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-white line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-2">
                      {product.warranty || '1 Year Warranty'} • In Stock
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between mt-auto">
                    <span className="font-black text-sm text-blue-400">
                      LKR {product.price?.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md shadow-blue-500/20"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
