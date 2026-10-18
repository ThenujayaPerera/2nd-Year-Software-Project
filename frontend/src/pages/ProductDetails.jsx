import { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCartStore, useWishlistStore } from '../store';
import { productAPI, reviewAPI, API_BASE_URL } from '../services/api';
import { 
  Star, ShoppingCart, Zap, Heart, ArrowLeft, Truck, ShieldCheck, 
  RotateCcw, Check, Share2, Store, HelpCircle, Phone, MessageSquare,
  Battery, Rocket, Sparkles, Smartphone, Plug, Activity, Shield, User
} from 'lucide-react';
import { officialCatalog } from '../data/officialCatalog';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
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
        fetch(`${API_BASE_URL}/products`)
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
          .catch(() => {
            const catalogItem = officialCatalog.find((p) => String(p.id) === String(id));
            if (isMounted && catalogItem) {
              setProduct(catalogItem);
              setSelectedImgIndex(0);
            }
          });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Fetch approved customer reviews for this product
    setReviewsLoading(true);
    reviewAPI.getByProduct(id)
      .then((res) => {
        if (isMounted && Array.isArray(res.data)) {
          setReviews(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch reviews:', err);
      })
      .finally(() => {
        if (isMounted) setReviewsLoading(false);
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

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1)
    : (product.rating ? Number(product.rating).toFixed(1) : '5.0');

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (r.rating && starCounts[r.rating] !== undefined) {
      starCounts[r.rating]++;
    }
  });

  return (
    <Layout>
      <div className="bg-slate-50/60 min-h-screen py-4 sm:py-8 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation - Responsive Scroll */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 mb-4 sm:mb-6 font-medium overflow-x-auto whitespace-nowrap hide-scrollbar py-1">
            <Link to="/" className="hover:text-blue-600 shrink-0">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600 shrink-0">Products</Link>
            <span>/</span>
            <Link to={`/products?q=${encodeURIComponent(product.category || '')}`} className="hover:text-blue-600 shrink-0">{product.category || 'Accessories'}</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
          </div>

          {/* Main 2-Column Product Stage */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 mb-12 sm:mb-16">
            
            {/* Left Column: Image Gallery with Discount Badge (5 cols) */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              {/* Main Showcase Image Frame */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-sm flex items-center justify-center aspect-square overflow-hidden group">
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-600 text-white font-black text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-md z-10 tracking-wide">
                  Rs.{discountAmount.toLocaleString()} OFF
                </div>

                <img
                  src={galleryImages[selectedImgIndex] || product.image}
                  alt={product.name}
                  className="max-h-[260px] sm:max-h-[380px] w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Multi-angle Thumbnails Carousel */}
              <div className="flex gap-2 sm:gap-3 justify-start overflow-x-auto pb-2 hide-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white p-1 sm:p-1.5 border-2 transition-all overflow-hidden shrink-0 ${
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
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              
              {/* Product Header */}
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">
                  {product.brand} • {product.category}
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-1 leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Verified Reviews Preview */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${Number(avgRating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-800">{avgRating}</span>
                  <span className="text-xs text-slate-300">•</span>
                  <a href="#customer-reviews" className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">
                    {totalReviews} {totalReviews === 1 ? 'Customer Review' : 'Customer Reviews'}
                  </a>
                </div>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-2.5 sm:gap-3 mt-2 sm:mt-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm sm:text-lg font-bold text-slate-400 line-through">
                      Rs. {product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    In Stock
                  </span>
                </div>

                {/* Delivery Charges & VAT Fee Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-200/80">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${product.isFreeDelivery || product.deliveryFee === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Fee</span>
                      {product.isFreeDelivery || product.deliveryFee === 0 ? (
                        <span className="text-xs sm:text-sm font-black text-emerald-700 flex items-center gap-1">
                          FREE Islandwide Delivery
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          Rs. {(product.deliveryFee || 350).toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">Islandwide</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${(product.vatRate || 0) > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Value Added Tax (VAT)</span>
                      {(product.vatRate || 0) > 0 ? (
                        <span className="text-xs sm:text-sm font-black text-indigo-900">
                          {product.vatRate}% VAT <span className="text-[10px] text-indigo-600 font-semibold">(Rs. {Math.round(product.price * product.vatRate / 100).toLocaleString()})</span>
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm font-black text-slate-700">
                          0% VAT <span className="text-[10px] text-emerald-600 font-semibold">(Tax Exempt)</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Quantity:</label>
                <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-slate-600 hover:bg-slate-100 font-bold transition-colors disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 sm:px-5 sm:py-2 font-bold text-slate-900 text-xs sm:text-sm border-x border-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Responsive for Mobile */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                <div className="flex gap-2 sm:gap-3 flex-1">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 sm:py-3.5 px-4 sm:px-6 bg-[#1a7f9b] hover:bg-[#156c84] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1a7f9b]/20 active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3 sm:py-3.5 px-4 sm:px-6 bg-[#111827] hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Buy Now
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`py-3 px-4 sm:p-3.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                    isInWishlist(product.id)
                      ? 'border-red-400 bg-red-50 text-red-500'
                      : 'border-slate-300 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  <span className="sm:hidden text-xs font-bold">Wishlist</span>
                </button>
              </div>

              {/* Toast Message when added */}
              {addedToCartToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Added to your shopping cart!
                </div>
              )}

              {/* Structured "About this product" Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 sm:space-y-5 text-xs sm:text-sm text-slate-700">
                
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

          {/* Dedicated Customer Ratings & Verified Reviews Section */}
          <div id="customer-reviews" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">
                  Authentic Customer Feedback
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  Verified Customer Reviews
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Only verified buyers who have received this product can submit an official rating and review.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Moderated & Verified
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 pt-8">
              {/* Rating Summary Breakdown (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                  <div className="text-5xl font-black text-slate-900 tracking-tight font-sans">
                    {avgRating}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${Number(avgRating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-2">
                    Based on {totalReviews} {totalReviews === 1 ? 'verified review' : 'verified reviews'}
                  </p>
                </div>

                {/* Rating Distribution Bars */}
                <div className="space-y-2.5">
                  {[5, 4, 3, 2, 1].map((ratingVal) => {
                    const count = starCounts[ratingVal] || 0;
                    const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

                    return (
                      <div key={ratingVal} className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-slate-700 w-12 flex items-center gap-1">
                          {ratingVal} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-slate-400 w-10 text-right font-medium">{percent}%</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-blue-600" /> How to Review
                  </p>
                  <p className="text-blue-700 text-[11px] leading-relaxed">
                    Purchase this product, wait for delivery confirmation, then click "Rate & Review" on your Orders page.
                  </p>
                </div>
              </div>

              {/* Individual Reviews Feed (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {reviewsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 animate-pulse space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-200 rounded w-1/4" />
                        <div className="h-12 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="p-10 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">No Reviews Yet</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Be the first verified customer to share your experience after purchasing and receiving this product.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                              {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">{rev.userName || 'Verified Customer'}</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  Verified Purchase
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent purchase'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${(rev.rating || 5) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
