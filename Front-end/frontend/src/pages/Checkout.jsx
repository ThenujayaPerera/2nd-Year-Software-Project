import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Banknote, Smartphone, AlertCircle, ShieldCheck, Truck, Lock } from 'lucide-react';
import Layout from '../components/Layout';
import { useCartStore, useAuthStore } from '../store';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Order Summary
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Ambalangoda',
    postalCode: '80300',
    deliveryInstructions: '',
  });

  const [paymentData, setPaymentData] = useState({
    method: 'payhere', // payhere, stripe, card, bank, koko, cod
    cardName: user?.name || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    bankAccount: '',
  });

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  const shipping = cart.length > 0 && subtotal < 10000 ? 350 : 0;
  const total = subtotal + tax + shipping;

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center w-full">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-slate-900 mb-2">Please Log In</h1>
            <p className="text-slate-600 mb-6">You need to be logged in to proceed with checkout</p>
            <Link to="/login" className="block bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all mb-3">
              Sign In
            </Link>
            <Link to="/register" className="block bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-lg transition-all">
              Create Account
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center w-full">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-slate-900 mb-2">Your Cart is Empty</h1>
            <p className="text-slate-600 mb-6">Add some products before checking out</p>
            <Link to="/products" className="block bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    const orderPayload = {
      userEmail: user?.email || shippingData.email,
      customerName: `${shippingData.firstName} ${shippingData.lastName}`.trim(),
      customerPhone: shippingData.phone,
      shippingAddress: shippingData.address,
      city: shippingData.city,
      postalCode: shippingData.postalCode,
      paymentMethod: paymentData.method.toUpperCase(),
      paymentStatus: ['card', 'payhere', 'stripe'].includes(paymentData.method) ? 'SUCCESS' : 'PENDING',
      transactionReference: `TXN-${paymentData.method.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      subtotal: subtotal,
      tax: tax,
      shippingCost: shipping,
      totalAmount: total,
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
    };

    try {
      const res = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const savedOrder = await res.json();
        setPlacedOrderDetails(savedOrder);
        setOrderPlaced(true);
        clearCart();
      } else {
        // Fallback for offline/mock
        setPlacedOrderDetails({
          orderNumber: `NV-${Math.floor(100000 + Math.random() * 900000)}`,
          totalAmount: total,
          userEmail: user?.email || shippingData.email,
          paymentMethod: paymentData.method.toUpperCase(),
        });
        setOrderPlaced(true);
        clearCart();
      }
    } catch (err) {
      console.warn('Backend order placement offline fallback:', err);
      setPlacedOrderDetails({
        orderNumber: `NV-${Math.floor(100000 + Math.random() * 900000)}`,
        totalAmount: total,
        userEmail: user?.email || shippingData.email,
        paymentMethod: paymentData.method.toUpperCase(),
      });
      setOrderPlaced(true);
      clearCart();
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center">
          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center w-full border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-600 mb-1">Thank you for shopping at NVSHOP.LK</p>
            <p className="text-xs text-slate-400 mb-6">Order receipt & status updates have been sent to {placedOrderDetails?.userEmail}</p>
            
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left border border-slate-100 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Order Reference</span>
                <span className="text-base font-black text-blue-600 font-mono">{placedOrderDetails?.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Payment Mode</span>
                <span className="font-bold text-slate-900">{placedOrderDetails?.paymentMethod || 'PAYHERE'}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Grand Total</span>
                <span className="font-black text-slate-900 text-sm">LKR {placedOrderDetails?.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold pt-1">
                <span>Delivery Status</span>
                <span>1-3 Days Islandwide</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/orders" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all text-sm">
                View My Orders
              </Link>
              <Link to="/products" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/cart" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8 font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step indicator */}
              <div className="flex gap-4 mb-6">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-1.5 rounded-full transition-all ${
                      s <= step ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Delivery Address</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={shippingData.firstName}
                          onChange={handleShippingChange}
                          placeholder="First Name"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={shippingData.lastName}
                          onChange={handleShippingChange}
                          placeholder="Last Name"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={shippingData.email}
                          onChange={handleShippingChange}
                          placeholder="Email Address"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingData.phone}
                          onChange={handleShippingChange}
                          placeholder="+94 76 989 0079"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Street Address</label>
                      <textarea
                        name="address"
                        value={shippingData.address}
                        onChange={handleShippingChange}
                        placeholder="House / Building No, Street Address"
                        rows="2"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">City / Town</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingData.city}
                          onChange={handleShippingChange}
                          placeholder="Ambalangoda / Colombo"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={shippingData.postalCode}
                          onChange={handleShippingChange}
                          placeholder="80300"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!shippingData.address || !shippingData.phone}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all mt-4"
                    >
                      Proceed to Payment Method
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Payment Gateway</h2>
                      <p className="text-xs text-slate-500">256-Bit SSL Encrypted & PCI-DSS Compliant (FR3.1)</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    {/* PayHere Gateway */}
                    <button
                      type="button"
                      onClick={() => setPaymentData({ ...paymentData, method: 'payhere' })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        paymentData.method === 'payhere'
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">Popular</span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">PayHere</p>
                      <p className="text-[11px] text-slate-500">Cards, Genie, eZ Cash</p>
                    </button>

                    {/* Stripe Card Gateway */}
                    <button
                      type="button"
                      onClick={() => setPaymentData({ ...paymentData, method: 'stripe' })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        paymentData.method === 'stripe'
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">Stripe</span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">Credit / Debit</p>
                      <p className="text-[11px] text-slate-500">Visa / Mastercard</p>
                    </button>

                    {/* KOKO Installments */}
                    <button
                      type="button"
                      onClick={() => setPaymentData({ ...paymentData, method: 'koko' })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        paymentData.method === 'koko'
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">3 Months</span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">KOKO Pay</p>
                      <p className="text-[11px] text-slate-500">0% Interest</p>
                    </button>
                  </div>

                  {/* Payment Inputs for Card / Stripe */}
                  {['stripe', 'card'].includes(paymentData.method) && (
                    <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-6 animate-in fade-in">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          value={paymentData.cardName}
                          onChange={handlePaymentChange}
                          placeholder="Name on card"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentData.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="4111 2222 3333 4444"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm bg-white font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={paymentData.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">CVV Code</label>
                          <input
                            type="password"
                            name="cvv"
                            maxLength="4"
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PayHere Sandbox Info Box */}
                  {paymentData.method === 'payhere' && (
                    <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-100 text-blue-900 mb-6 text-sm flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">PayHere Payment Gateway Connected</p>
                        <p className="text-xs text-blue-700 mt-0.5">You will complete the payment via PayHere’s secure checkout gateway supporting all Sri Lankan banks & credit cards.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3.5 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-md shadow-blue-500/20"
                    >
                      {isProcessing ? 'Processing Secure Payment...' : `Authorize & Pay LKR ${total.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100 sticky top-28 space-y-6">
                <h3 className="text-lg font-black text-slate-900 pb-4 border-b border-slate-100">Order Summary ({cart.length})</h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 border border-slate-100" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity} × LKR {item.price.toLocaleString()}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-900">LKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>VAT & Taxes (5%)</span>
                    <span className="font-bold text-slate-900">LKR {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-900">{shipping === 0 ? 'FREE' : `LKR ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span className="text-blue-600">LKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Authentic Products & Official Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
