import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, createOrder, updateProfile, WHATSAPP_NUMBER } from '../api';

export default function Checkout({ user }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });
  const [submitting, setSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getCart().then(items => {
      if (items.length === 0) { navigate('/cart'); return; }
      setItems(items);
    });
  }, [user]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '', city: '' });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) return alert('يرجى ملء جميع الحقول');
    setSubmitting(true);
    try {
      const orderItems = items.map(i => ({ productId: i.productId, name: i.nameAr, price: i.price, quantity: i.quantity }));
      const result = await createOrder({ items: orderItems, shippingName: form.name, shippingPhone: form.phone, shippingAddress: form.address, shippingCity: form.city });
      await updateProfile({ name: form.name, phone: form.phone, address: form.address }).catch(() => {});
      setOrderId(result.id);
      setOrderDone(true);
    } catch (e) {
      alert(e.message || 'حدث خطأ');
    } finally {
      setSubmitting(false);
    }
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (orderDone) {
    const msg = `طلب جديد #${orderId}%0aالعميل: ${form.name}%0aالجوال: ${form.phone}%0aالعنوان: ${form.city} - ${form.address}%0a%0aالمنتجات:%0a${items.map(i => `- ${i.nameAr} × ${i.quantity} = ${i.price * i.quantity} د.م.`).join('%0a')}%0a%0aالإجمالي: ${total} د.م.`;
    return (
      <div className="checkout-page container" style={{ textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: '4rem', marginBottom: 20 }}>✅</div>
        <h2>تم تأكيد الطلب #{orderId}</h2>
        <p style={{ color: 'var(--text-light)', margin: '15px 0 25px' }}>سنقوم بالتواصل معك قريباً</p>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '12px 35px', marginBottom: 12 }}>
          📱 تواصل معنا واتساب
        </a>
        <br />
        <button className="btn btn-outline" onClick={() => navigate('/profile')}>← طلباتي</button>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h1 style={{ marginBottom: 30 }}>إتمام الطلب</h1>
      <div className="checkout-grid">
        <form onSubmit={handleSubmit}>
          <div className="auth-form" style={{ maxWidth: '100%' }}>
            <h2>معلومات الشحن</h2>
            <div className="form-group">
              <label>الاسم الكامل</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>رقم الجوال</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>المدينة</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>العنوان</label>
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'جاري التأكيد...' : 'تأكيد الطلب'}
            </button>
          </div>
        </form>
        <div className="order-summary">
          <h3 style={{ marginBottom: 15 }}>ملخص الطلب</h3>
          {items.map(item => (
            <div key={item.id} className="item">
              <span>{item.nameAr} × {item.quantity}</span>
              <span>{item.price * item.quantity} د.م.</span>
            </div>
          ))}
          <div className="item" style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: 10 }}>
            <span>الإجمالي</span>
            <span style={{ color: 'var(--primary-dark)' }}>{total} د.م.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
