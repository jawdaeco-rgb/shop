import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { getMe, WHATSAPP_NUMBER } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartVersion, setCartVersion] = useState(0);

  const refreshCart = () => setCartVersion(v => v + 1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe().then(u => setUser(u)).catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} setUser={setUser} cartVersion={cartVersion} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home user={user} refreshCart={refreshCart} />} />
          <Route path="/products" element={<Products user={user} refreshCart={refreshCart} />} />
          <Route path="/products/:id" element={<ProductDetail user={user} refreshCart={refreshCart} />} />
          <Route path="/cart" element={<Cart user={user} refreshCart={refreshCart} />} />
          <Route path="/checkout" element={<Checkout user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/admin" element={<Admin user={user} refreshCart={refreshCart} />} />
        </Routes>
      </main>
      <Footer />
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', bottom: 20, left: 20, background: '#25D366', color: 'white', width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', zIndex: 999, transition: 'transform 0.3s' }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
        💬
      </a>
    </div>
  );
}
