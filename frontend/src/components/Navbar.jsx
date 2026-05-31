import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCart } from '../api';

export default function Navbar({ user, setUser, cartVersion }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      getCart().then(items => setCartCount(items.reduce((s, i) => s + i.quantity, 0))).catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [user, cartVersion]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const path = window.location.pathname;

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          أناقة<span>💎</span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/" className={path === '/' ? 'active' : ''}>الرئيسية</Link></li>
          <li><Link to="/products" className={path.includes('/products') ? 'active' : ''}>المنتجات</Link></li>
          {user?.isAdmin ? (
            <li><Link to="/admin" className={path === '/admin' ? 'active' : ''}>لوحة التحكم</Link></li>
          ) : null}
        </ul>
        <div className="nav-icons">
          {user ? (
            <>
              <Link to="/profile">👤</Link>
              <button onClick={() => navigate('/cart')}>
                🛒
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </button>
              <button onClick={handleLogout}>🚪</button>
            </>
          ) : (
            <>
              <Link to="/login">دخول</Link>
              <Link to="/register" className="btn btn-primary btn-sm">تسجيل</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
