import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Comparison from "./pages/Comparison";
import Admin from "./pages/Admin";
import Wishlist from "./pages/Wishlist";
import UserProfile from "./pages/UserProfile";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import Returns from "./pages/Returns";
import Faq from "./pages/Faq";
import ShippingInfo from "./pages/ShippingInfo";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/about" element={<About />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/shipping-info" element={<ShippingInfo />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-conditions" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;