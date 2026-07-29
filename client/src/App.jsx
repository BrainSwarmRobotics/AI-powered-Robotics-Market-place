import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Catalogue />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/compare" element={<Compare />} />
    </Routes>
  );
}

export default App;