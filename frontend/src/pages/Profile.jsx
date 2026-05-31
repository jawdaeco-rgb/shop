import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getOrders, getMe } from '../api';

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMe().then(u => setUser(u)).catch(() => {});
    getOrders().then(setOrders).catch(() => {});
  }, [user]);

  const statusColors = { pending: 'status-pending', shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled' };
  const statusNames = { pending: 'قيد الانتظار', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي' };

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 30 }}>
      <h1 style={{ marginBottom: 20 }}>مرحباً، {user?.name}</h1>

      <div className="tabs" style={{ display: 'flex', gap: 10, marginBottom: 25, borderBottom: '2px solid var(--border)', paddingBottom: 10 }}>
        <button className={tab === 'orders' ? 'active btn btn-primary btn-sm' : 'btn btn-outline btn-sm'} onClick={() => setTab('orders')}>طلباتي</button>
        <button className={tab === 'info' ? 'active btn btn-primary btn-sm' : 'btn btn-outline btn-sm'} onClick={() => setTab('info')}>معلوماتي</button>
      </div>

      {tab === 'orders' && (
        <div className="orders-page" style={{ padding: 0 }}>
          {orders.length === 0 ? (
            <div className="empty-cart">
              <div className="icon">📦</div>
              <p>لا توجد طلبات بعد</p>
              <Link to="/products" className="btn btn-primary">تسوق الآن</Link>
            </div>
          ) : orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="header">
                <span>طلب #{order.id}</span>
                <span className={`status ${statusColors[order.status] || ''}`}>{statusNames[order.status] || order.status}</span>
              </div>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>{item.price * item.quantity} د.م.</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', fontWeight: 700 }}>
                <span>الإجمالي</span>
                <span style={{ color: 'var(--primary-dark)' }}>{order.total} د.م.</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'info' && (
        <div className="auth-form" style={{ maxWidth: 500 }}>
          <p><strong>الاسم:</strong> {user?.name}</p>
          <p style={{ marginTop: 10 }}><strong>البريد:</strong> {user?.email}</p>
          <p style={{ marginTop: 10 }}><strong>الجوال:</strong> {user?.phone || 'غير محدد'}</p>
          <p style={{ marginTop: 10 }}><strong>العنوان:</strong> {user?.address || 'غير محدد'}</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-block' }}>
            ← تسوق
          </Link>
        </div>
      )}
    </div>
  );
}
