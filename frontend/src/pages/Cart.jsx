import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../api';
import { getProductImage } from '../utils';

export default function Cart({ user, refreshCart }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadCart();
  }, [user]);

  const loadCart = () => {
    setLoading(true);
    getCart().then(setItems).catch(() => {}).finally(() => setLoading(false));
  };

  const handleQty = async (id, qty) => {
    if (qty < 1) return handleRemove(id);
    await updateCartItem(id, qty);
    await loadCart();
    refreshCart();
  };

  const handleRemove = async (id) => {
    await removeCartItem(id);
    await loadCart();
    refreshCart();
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="cart-page container">
      <h1>🛒 سلة التسوق</h1>
      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="icon">🛍️</div>
          <p>سلتك فارغة</p>
          <Link to="/products" className="btn btn-primary">تسوق الآن</Link>
        </div>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-img" style={{ overflow: 'hidden', padding: 0 }}>
                <img src={getProductImage(item, 200)} alt={item.nameAr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="item-info">
                <h3>{item.nameAr}</h3>
                <div className="price">{item.price.toFixed(2)} د.م.</div>
              </div>
              <div className="qty-control">
                <button onClick={() => handleQty(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQty(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="item-total">{(item.price * item.quantity).toFixed(2)} د.م.</div>
              <button className="remove-btn" onClick={() => handleRemove(item.id)}>🗑️</button>
            </div>
          ))}
          <div className="cart-summary">
            <div className="row"><span>المجموع</span><span>{total.toFixed(2)} د.م.</span></div>
            <div className="row"><span>الشحن</span><span>مجاني</span></div>
            <div className="row total"><span>الإجمالي</span><span>{total.toFixed(2)} د.م.</span></div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 15 }}
              onClick={() => navigate('/checkout')}>
              إتمام الطلب
            </button>
          </div>
        </>
      )}
    </div>
  );
}
