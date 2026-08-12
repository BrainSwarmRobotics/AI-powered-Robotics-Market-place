import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

function ComingSoon({ title }) {
  return (
    <div className="py-24 text-center">
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-neutral-600">This page isn't built yet.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Catalogue />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<ComingSoon title="Account" />} />
        <Route path="/about" element={<ComingSoon title="About Brainswarm" />} />
        <Route path="/contact" element={<ComingSoon title="Contact" />} />
        <Route path="/support/shipping" element={<ComingSoon title="Shipping & Delivery" />} />
        <Route path="/support/returns" element={<ComingSoon title="Returns" />} />
        <Route path="/support/track-order" element={<ComingSoon title="Track Order" />} />
        <Route path="/legal/privacy" element={<ComingSoon title="Privacy Policy" />} />
        <Route path="/legal/terms" element={<ComingSoon title="Terms of Service" />} />
      </Route>
    </Routes>
  );
}

export default App;
