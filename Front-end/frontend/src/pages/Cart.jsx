import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import CartItem from '../components/CartItem';
import Alert from '../components/Alert';
import { useCartStore, useAuthStore, useComparisonStore } from '../store';
import { ShoppingBag, ArrowRight, Trash2, Scale } from 'lucide-react';

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const { isAuthenticated } = useAuthStore();
  const addToComparison = useComparisonStore((state) => state.addToComparison);
  const [alert, setAlert] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.08); // 8% VAT
  const shipping = cart.length > 0 && subtotal < 10000 ? 450 : 0; // 450 LKR delivery, free over 10,000 LKR
  const total = subtotal + tax + shipping;

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setAlert({ type: 'info', message: 'Item removed from cart' });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      setSelectedItems([]);
      setAlert({ type: 'success', message: 'Cart cleared' });
    }
  };

  const handleSelectItem = (productId) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item.id));
    }
  };

  const handleCompareSelected = () => {
    if (selectedItems.length === 0) {
      setAlert({ type: 'warning', message: 'Please select items to compare' });
      return;
    }
    
    const itemsToCompare = cart.filter(item => selectedItems.includes(item.id));
    let addedCount = 0;
    
    itemsToCompare.forEach(item => {
      if (addedCount < 4) {
        addToComparison(item);
        addedCount++;
      }
    });
    
    setAlert({ type: 'success', message: `Added ${addedCount} item(s) to comparison` });
    setSelectedItems([]);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block font-mono">Checkout</span>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Shopping Bag</h1>
          <p className="text-slate-500">Review your items before checking out.</p>
        </div>

        {alert && (
          <div className="mb-8">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Your Bag is Empty</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn-primary inline-flex">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select All Section */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cart.length && cart.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                  title="Select all items"
                />
                <span className="font-semibold text-slate-700">Select All</span>
                {selectedItems.length > 0 && (
                  <span className="ml-auto text-sm font-bold text-primary">{selectedItems.length} selected</span>
                )}
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
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

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCompareSelected}
                  disabled={selectedItems.length === 0}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Scale className="w-4 h-4" /> Compare Selected
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 py-4 border border-red-100 hover:border-red-200 text-red-500 hover:bg-red-50/50 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 sticky top-28">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="font-bold text-slate-900">LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">VAT (8%)</span>
                    <span className="font-bold text-slate-900">LKR {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Shipping</span>
                    <span className="font-bold text-slate-900">
                      {shipping === 0 ? (
                        <span className="text-emerald-600 uppercase font-black tracking-wider text-xs">Free</span>
                      ) : (
                        `LKR ${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Due</p>
                    <p className="text-3xl font-black text-slate-900">LKR {total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to={isAuthenticated ? "/checkout" : "/login"} className="w-full py-4 bg-primary hover:bg-primary/95 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link to="/products" className="w-full py-4 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-2xl font-bold text-center block transition-all">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
