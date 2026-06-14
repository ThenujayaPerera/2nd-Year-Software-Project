import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Banknote, Smartphone, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useCartStore, useAuthStore } from '../store';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Order Summary
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    deliveryInstructions: '',
  });

  const [paymentData, setPaymentData] = useState({
    method: 'card', // card, bank, koko
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    bankAccount: '',
  });

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.08);
  const shipping = cart.length > 0 && subtotal < 10000 ? 450 : 0;
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

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center w-full animate-in fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-green-600 mb-2">Order Placed!</h1>
            <p className="text-slate-600 mb-2">Thank you for your purchase</p>
            <p className="text-sm text-slate-500 mb-6">Order confirmation has been sent to your email</p>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-2">Order Number</p>
              <p className="text-xl font-black text-slate-900 font-mono">ORD-{Date.now()}</p>
            </div>

            <Link to="/" className="block bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Link to="/cart" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-semibold">
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step Indicator */}
              <div className="flex gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      s <= step ? 'bg-primary' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 mb-6">Shipping Address</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleShippingChange}
                        placeholder="First Name"
                        className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleShippingChange}
                        placeholder="Last Name"
                        className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>

                    <input
                      type="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                      placeholder="Email Address"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                    />

                    <textarea
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      placeholder="Street Address"
                      rows="3"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        placeholder="City"
                        className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingData.postalCode}
                        onChange={handleShippingChange}
                        placeholder="Postal Code"
                        className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>

                    <textarea
                      name="deliveryInstructions"
                      value={shippingData.deliveryInstructions}
                      onChange={handleShippingChange}
                      placeholder="Delivery Instructions (Optional)"
                      rows="2"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                    />

                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 mb-6">Payment Method</h2>

                  <div className="space-y-4 mb-6">
                    {/* Payment Method Selector */}
                    <div className="grid grid-cols-3 gap-4">
                      <label className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentData.method === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}>
                        <input
                          type="radio"
                          name="method"
                          value="card"
                          checked={paymentData.method === 'card'}
                          onChange={handlePaymentChange}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center mb-2">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-center">Credit/Debit Card</p>
                      </label>

                      <label className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentData.method === 'bank'
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}>
                        <input
                          type="radio"
                          name="method"
                          value="bank"
                          checked={paymentData.method === 'bank'}
                          onChange={handlePaymentChange}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center mb-2">
                          <Banknote className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-center">Bank Transfer</p>
                      </label>

                      <label className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentData.method === 'koko'
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}>
                        <input
                          type="radio"
                          name="method"
                          value="koko"
                          checked={paymentData.method === 'koko'}
                          onChange={handlePaymentChange}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center mb-2">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-center">Koko Pay</p>
                      </label>
                    </div>
                  </div>

                  {/* Card Payment */}
                  {paymentData.method === 'card' && (
                    <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                        placeholder="Cardholder Name"
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="Card Number"
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                        <input
                          type="text"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          placeholder="CVV"
                          className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer */}
                  {paymentData.method === 'bank' && (
                    <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-900">Bank transfer details will be provided after you complete this step.</p>
                      <input
                        type="text"
                        name="bankName"
                        value={paymentData.bankName}
                        onChange={handlePaymentChange}
                        placeholder="Your Bank Name"
                        className="w-full px-4 py-2.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        name="bankAccount"
                        value={paymentData.bankAccount}
                        onChange={handlePaymentChange}
                        placeholder="Account Number"
                        className="w-full px-4 py-2.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  )}

                  {/* Koko Pay */}
                  {paymentData.method === 'koko' && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 mb-6">
                      <p className="text-sm text-purple-900">You will be redirected to Koko Pay to complete your 3-month installment plan.</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-lg transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {step === 3 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 mb-6">Review Your Order</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-3">Shipping To:</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {shippingData.firstName} {shippingData.lastName}<br />
                        {shippingData.address}<br />
                        {shippingData.city}, {shippingData.postalCode}<br />
                        {shippingData.phone}
                      </p>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-bold text-slate-900 mb-3">Payment Method:</h3>
                      <p className="text-slate-600 text-sm">
                        {paymentData.method === 'card' && '💳 Credit/Debit Card'}
                        {paymentData.method === 'bank' && '🏦 Bank Transfer'}
                        {paymentData.method === 'koko' && '📱 Koko Pay (3 Installments)'}
                      </p>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-bold text-slate-900 mb-3">Items:</h3>
                      <div className="space-y-2 text-sm">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between">
                            <span className="text-slate-600">{item.name} x {item.quantity}</span>
                            <span className="font-bold text-slate-900">LKR {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-lg transition-all"
                    >
                      Edit Payment
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary - Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Items ({cart.length})</span>
                    <span className="font-bold">LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">VAT (8%)</span>
                    <span className="font-bold">LKR {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-bold">
                      {shipping === 0 ? (
                        <span className="text-green-600 uppercase text-xs">Free</span>
                      ) : (
                        `LKR ${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4 mb-6">
                  <p className="text-xs text-slate-600 uppercase tracking-wide font-bold mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-primary">LKR {total.toLocaleString()}</p>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="text-xs bg-slate-50 p-2 rounded">
                      <p className="font-semibold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-slate-600">Qty: {item.quantity} × LKR {item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
