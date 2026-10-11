import { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCartStore, useWishlistStore } from '../store';
import { productAPI } from '../services/api';
import { 
  Star, ShoppingCart, Zap, Heart, ArrowLeft, Truck, ShieldCheck, 
  RotateCcw, Check, Share2, Store, HelpCircle, Phone, MessageSquare,
  Battery, Rocket, Sparkles, Smartphone, Plug, Activity, Shield
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    productAPI.getById(id)
      .then((res) => {
        if (isMounted && res.data) {
          const item = res.data;
          setProduct(item);
          setSelectedImgIndex(0);
        }
      })
      .catch(() => {
        // Fetch from all products if by ID direct endpoint failed
        fetch('http://localhost:8080/api/products')
          .then((r) => r.json())
          .then((all) => {
            if (isMounted && Array.isArray(all)) {
              const found = all.find((p) => String(p.id) === String(id));
              if (found) {
                setProduct(found);
                setSelectedImgIndex(0);
              }
            }
          })
          .catch((e) => console.warn(e));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-4" />
          <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-10 bg-slate-200 rounded w-3/4" />
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-32 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-slate-500 mb-6 text-sm">The product you are looking for is currently unavailable.</p>
          <Link to="/products" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs inline-block">
            Browse All Products
          </Link>
        </div>
      </Layout>
    );
  }

  // Real Gallery Images from Database
  const galleryImages = [
    product.image,
    ...(product.galleryImages || [])
  ];

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  const discountAmount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(product.originalPrice - product.price)
    : 1000;

  const brandName = product.brand || 'NV-Genuine';

  return (
    <Layout>
      <div className="bg-slate-50/60 min-h-screen py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <Link to={`/products?q=${encodeURIComponent(product.category || '')}`} className="hover:text-blue-600">{product.category || 'Accessories'}</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
          </div>

          {/* Main 2-Column Product Stage */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            
            {/* Left Column: Image Gallery with Discount Badge (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Main Showcase Image Frame */}
              <div className="relative bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm flex items-center justify-center aspect-square overflow-hidden group">
                
                {/* Rs. 1000 OFF Badge (Exact NVSHOP Style) */}
                <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md z-10 tracking-wide">
                  Rs.{discountAmount.toLocaleString()} OFF
                </div>

                <img
                  src={galleryImages[selectedImgIndex] || product.image}
                  alt={product.name}
                  className="max-h-[380px] w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Multi-angle Thumbnails Carousel */}
              <div className="flex gap-3 justify-start overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-20 h-20 rounded-2xl bg-white p-1.5 border-2 transition-all overflow-hidden shrink-0 ${
                      selectedImgIndex === idx
                        ? 'border-blue-600 shadow-md shadow-blue-500/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Title, Quantity, Add to Cart & "About this product" (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Product Header */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">
                  {product.brand} • {product.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 leading-snug">
                  {product.name}
                </h1>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-3xl font-black text-slate-900 font-sans">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg font-bold text-slate-400 line-through">
                      Rs. {product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Quantity:</label>
                <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold transition-colors disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="px-5 py-2 font-bold text-slate-900 text-sm border-x border-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now (Exact NVSHOP Style) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[150px] py-3.5 px-6 bg-[#1a7f9b] hover:bg-[#156c84] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1a7f9b]/20"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[150px] py-3.5 px-6 bg-[#111827] hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Buy Now
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isInWishlist(product.id)
                      ? 'border-red-400 bg-red-50 text-red-500'
                      : 'border-slate-300 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Toast Message when added */}
              {addedToCartToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" /> Added to your shopping cart!
                </div>
              )}

              {/* Structured "About this [Brand] product" Specification Card (Exact NVSHOP Layout) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5 text-sm text-slate-700">
                
                <h3 className="text-lg font-black text-slate-900">
                  About this {brandName} product
                </h3>

                {/* Main Product Tagline */}
                <p className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <Battery className="w-5 h-5 text-emerald-500" /> {product.name}
                </p>

                {/* Dynamic Overview Paragraphs & Features */}
                <div className="space-y-3">
                  {product.description?.split('\n').map((line, idx) => {
                    const t = line.trim();
                    if (!t) return null;
                    
                    if (t.startsWith('-')) {
                      const text = t.substring(1).trim();
                      const boldPart = text.includes('–') ? text.split('–')[0] : '';
                      const restPart = text.includes('–') ? '– ' + text.split('–').slice(1).join('–') : text;
                      return (
                        <div key={idx} className="flex items-start gap-2.5 ml-2 pt-1">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-sm text-slate-600">
                            {boldPart ? <strong>{boldPart} </strong> : null}
                            {restPart}
                          </span>
                        </div>
                      );
                    }
                    
                    if (t.toLowerCase().includes('key features')) {
                       return (
                        <h4 key={idx} className="font-bold text-slate-900 pb-1 mt-6 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                          <Sparkles className="w-4 h-4 text-indigo-500" /> {t}
                        </h4>
                       );
                    }
                    
                    return (
                      <p key={idx} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {idx === 0 ? <Zap className="w-4 h-4 text-amber-500 inline mr-1 -mt-0.5" /> : null}
                        {t}
                      </p>
                    );
                  })}
                </div>

                {/* Description Images (if any) */}
                {product.descriptionImages && product.descriptionImages.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {product.descriptionImages.map((imgUrl, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200">
                        <img src={imgUrl} alt={`Product Feature ${idx + 1}`} className="w-full h-auto object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Showroom & Islandwide Delivery Note */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-3 mt-4">
                  <Store className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Available in Showroom & Online Delivery</p>
                    <p className="text-blue-700 mt-0.5">
                      Visit our showroom at 185/1/2B New Road, Ambalangoda or order online with Cash on Delivery (1-3 days islandwide).
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
