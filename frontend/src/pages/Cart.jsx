import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CartItem from '../components/CartItem';
import Alert from '../components/Alert';
import { useCartStore, useAuthStore, useComparisonStore } from '../store';
import { 
  ShoppingBag, ArrowRight, Trash2, Scale, Truck, ShieldCheck, 
  Store, Phone, CheckCircle, Tag, ArrowLeft 
} from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const { isAuthenticated } = useAuthStore();
  const addToComparison = useComparisonStore((state) => state.addToComparison);
  
  const [alert, setAlert] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const freeShippingThreshold = 10000;
  const shipping = cart.length > 0 && subtotal >= freeShippingThreshold ? 0 : (cart.length > 0 ? 450 : 0);
  const total = Math.max(0, subtotal - discountApplied + shipping);
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
    setAlert({ type: 'info', message: 'Item removed from your cart' });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
      setSelectedItems([]);
      setDiscountApplied(0);
      setAlert({ type: 'success', message: 'Shopping cart cleared' });
    }
  };

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  const handleCompareSelected = () => {
    if (selectedItems.length === 0) {
      setAlert({ type: 'warning', message: 'Please select items to compare' });
      return;
    }
    const itemsToCompare = cart.filter((item) => selectedItems.includes(item.id));
    itemsToCompare.forEach((item) => addToComparison(item));
    setAlert({ type: 'success', message: `Added ${itemsToCompare.length} item(s) to comparison` });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.toUpperCase() === 'NV10' || couponCode.toUpperCase() === 'NVSHOP') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountApplied(disc);
      setAlert({ type: 'success', message: 'Promo code applied! You received a 10% discount.' });
    } else if (couponCode.toUpperCase() === 'WELCOME1000') {
      setDiscountApplied(1000);
      setAlert({ type: 'success', message: 'Promo code applied! Rs. 1,000 discount applied.' });
    } else {
      setAlert({ type: 'error', message: 'Invalid or expired promo code.' });
    }
  };

  return (
    <Layout>
      <div className="bg-slate-50/60 min-h-screen py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Shopping Cart</span>
          </div>

          {/* Cart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                Your Shopping Cart
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart • Original NVSHOP.LK Accessories
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* Alert Toast */}
          {alert && (
            <div className="mb-6">
              <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            </div>
          )}

          {cart.length === 0 ? (
            /* EMPTY CART STATE (Exact NVSHOP Style) */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto shadow-sm my-8">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
                Explore our authentic collection of Anker, UGREEN, Baseus chargers, power banks, earphones, and phone protection.
              </p>
              <Link
                to="/products"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm inline-flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
              >
                Browse All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* ACTIVE CART GRID (2 Columns) */
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left 8 Cols: Items List & Free Shipping Banner */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Free Delivery Target Progress Banner */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="flex items-center gap-2 text-slate-800">
                      <Truck className="w-4 h-4 text-blue-600" />
                      {freeShippingRemaining === 0 ? (
                        <span className="text-emerald-600">🎉 Congratulations! You have unlocked Free Islandwide Delivery!</span>
                      ) : (
                        <span>Add <strong className="text-blue-600">Rs. {freeShippingRemaining.toLocaleString()}</strong> more to get Free Delivery!</span>
                      )}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{freeShippingProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        freeShippingRemaining === 0 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Cart Action Header (Select All & Bulk Compare) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2.5 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cart.length && cart.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                    <span>Select All ({cart.length})</span>
                  </label>

                  <div className="flex items-center gap-3">
                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleCompareSelected}
                        className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                      >
                        <Scale className="w-3.5 h-3.5" /> Compare ({selectedItems.length})
                      </button>
                    )}

                    <button
                      onClick={handleClearCart}
                      className="text-slate-400 hover:text-red-600 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                    </button>
                  </div>
                </div>

                {/* List of Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      isSelected={selectedItems.includes(item.id)}
                      onSelectChange={() => handleSelectItem(item.id)}
                    />
                  ))}
                </div>

              </div>

              {/* Right 4 Cols: Order Summary, Coupon & Checkout Action */}
              <div className="lg:col-span-4 space-y-4 sticky top-24">
                
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
                  <h3 className="text-lg font-black text-slate-900">Order Summary</h3>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 text-sm text-slate-600 pb-4 border-b border-slate-100">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-slate-900 font-sans">Rs. {subtotal.toLocaleString()}</span>
                    </div>

                    {discountApplied > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount</span>
                        <span>-Rs. {discountApplied.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Islandwide Delivery</span>
                      <span className="font-bold font-sans">
                        {shipping === 0 ? (
                          <span className="text-emerald-600 uppercase font-black text-xs">FREE</span>
                        ) : (
                          `Rs. ${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Total Due */}
                  <div className="flex justify-between items-baseline pt-1">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Amount</p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                        Rs. {total.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">LKR (All taxes incl.)</span>
                  </div>

                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon (e.g. NV10)"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50 uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Checkout Button (NVSHOP Style) */}
                  <div className="space-y-2.5 pt-2">
                    <Link
                      to="/checkout"
                      className="w-full py-4 bg-[#111827] hover:bg-black text-white font-bold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 group"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to="/products"
                      className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl text-center block transition-all"
                    >
                      Add More Products
                    </Link>
                  </div>

                </div>

                {/* Trust & Guarantee Box (Exact NVSHOP Details) */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>100% Genuine Branded Warranty</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cash on Delivery (Islandwide 1-3 Days)</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Store className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Showroom: 185/1/2B New Road, Ambalangoda</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Hotline: +94 76 989 0079 (Open 7 Days)</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
