import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import CartItem from '../components/CartItem';
import Alert from '../components/Alert';
import { useCartStore } from '../store';

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const [alert, setAlert] = useState(null);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = cart.length > 0 ? 5 : 0;
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
      setAlert({ type: 'success', message: 'Cart cleared' });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {cart.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <Link to="/products" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              <button
                onClick={handleClearCart}
                className="btn-danger w-full"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>

                <button className="btn-primary w-full mb-3">
                  Proceed to Checkout
                </button>

                <Link to="/products" className="btn-secondary w-full text-center block">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}