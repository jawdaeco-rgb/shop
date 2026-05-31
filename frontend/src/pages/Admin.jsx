import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, getProducts, getCategories, createProduct, updateProduct, deleteProduct, createCategory, deleteCategory, WHATSAPP_NUMBER } from '../api';

export default function Admin({ user, refreshCart }) {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newCat, setNewCat] = useState('');

  const emptyForm = { name: '', nameAr: '', description: '', descriptionAr: '', price: '', oldPrice: '', categoryId: 1, isFeatured: false, rating: 4.5, inStock: 1 };
  const [form, setForm] = useState(emptyForm);

  const loadData = () => {
    getAllOrders().then(setOrders).catch(() => {});
    getProducts().then(setProducts).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
  };

  useEffect(() => {
    if (!user?.isAdmin) return;
    loadData();
  }, [user]);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    const data = await getAllOrders();
    setOrders(data);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name, nameAr: p.nameAr, description: p.description || '',
      descriptionAr: p.descriptionAr || '', price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : '', categoryId: p.categoryId,
      isFeatured: !!p.isFeatured, rating: p.rating, inStock: p.inStock
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    const data = { ...form, price: parseFloat(form.price), oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null, rating: parseFloat(form.rating) };
    if (editing) {
      await updateProduct(editing, data);
    } else {
      await createProduct(data);
    }
    setShowForm(false);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm('تأكيد حذف المنتج؟')) return;
    await deleteProduct(id);
    loadData();
    refreshCart();
  };

  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    const names = newCat.split('/');
    await createCategory({ name: names[0] || newCat, nameAr: names[1] || newCat });
    setNewCat('');
    loadData();
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('تأكيد حذف التصنيف؟')) return;
    await deleteCategory(id);
    loadData();
  };

  const statusColors = { pending: 'status-pending', shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled' };

  if (!user?.isAdmin) return <div className="container" style={{ padding: 40, textAlign: 'center' }}>غير مصرح لك</div>;

  return (
    <div className="admin-page container">
      <h1 style={{ marginBottom: 20 }}>لوحة التحكم</h1>
      <div className="tabs">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>الطلبات</button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>المنتجات</button>
        <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>التصنيفات</button>
      </div>

      {tab === 'orders' && (
        <table className="admin-table">
          <thead><tr><th>#</th><th>العميل</th><th>المنتجات</th><th>المجموع</th><th>تاريخ</th><th>الحالة</th><th>واتساب</th></tr></thead>
          <tbody>
            {orders.map(order => {
              const waMsg = `طلب #${order.id}%0aالعميل: ${order.userName}%0aالجوال: ${order.shippingPhone}%0aالعنوان: ${order.shippingCity} - ${order.shippingAddress}%0a%0aالمنتجات:%0a${order.items?.map(i => `- ${i.name} × ${i.quantity} = ${i.price * i.quantity} د.م.`).join('%0a')}%0a%0aالإجمالي: ${order.total} د.م.%0aالحالة: ${order.status === 'pending' ? 'قيد الانتظار' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}`;
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userName}<br /><small style={{ color: 'var(--text-light)' }}>{order.shippingPhone}</small></td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {order.items?.map((i, idx) => <div key={idx}>{i.name} × {i.quantity}</div>)}
                  </td>
                  <td>{order.total} د.م.</td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                  <td>
                    <select value={order.status} onChange={e => handleStatus(order.id, e.target.value)}
                      style={{ padding: '6px 12px', border: '2px solid var(--border)', borderRadius: 8, background: 'white' }}>
                      <option value="pending">قيد الانتظار</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التوصيل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </td>
                  <td>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary" style={{ textDecoration: 'none' }}>
                      📱
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {tab === 'products' && (
        <>
          <button className="btn btn-primary" style={{ marginBottom: 15 }} onClick={openNew}>+ إضافة منتج</button>
          {showForm && (
            <div className="modal-overlay">
              <div className="modal" style={{ maxWidth: 500, textAlign: 'right' }}>
                <h3>{editing ? 'تعديل منتج' : 'إضافة منتج'}</h3>
                <div className="form-group"><label>الاسم (إنجليزي)</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div className="form-group"><label>الاسم (عربي)</label><input value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} /></div>
                <div className="form-group"><label>السعر</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
                <div className="form-group"><label>السعر القديم (اختياري)</label><input type="number" step="0.01" value={form.oldPrice} onChange={e => setForm({...form, oldPrice: e.target.value})} /></div>
                <div className="form-group">
                  <label>التصنيف</label>
                  <select value={form.categoryId} onChange={e => setForm({...form, categoryId: Number(e.target.value)})}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} /> منتج مميز</label>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 15 }}>
                  <button className="btn btn-primary" onClick={handleSave}>حفظ</button>
                  <button className="btn btn-outline" onClick={() => setShowForm(false)}>إلغاء</button>
                </div>
              </div>
            </div>
          )}
          <table className="admin-table">
            <thead><tr><th>#</th><th>الاسم</th><th>السعر</th><th>التصنيف</th><th>مميز</th><th>إجراءات</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nameAr}</td>
                  <td>{p.price} د.م.</td>
                  <td>{p.categoryNameAr || p.categoryName}</td>
                  <td>{p.isFeatured ? '⭐' : '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline" style={{ marginLeft: 5 }} onClick={() => openEdit(p)}>تعديل</button>
                    <button className="btn btn-sm btn-outline" style={{ borderColor: '#e74c3c', color: '#e74c3c' }} onClick={() => handleDelete(p.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'categories' && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="اسم التصنيف (English/Arabic)" style={{ flex: 1, padding: '10px 16px', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />
            <button className="btn btn-primary btn-sm" onClick={handleAddCategory}>إضافة</button>
          </div>
          <table className="admin-table">
            <thead><tr><th>#</th><th>الاسم (إنجليزي)</th><th>الاسم (عربي)</th><th>إجراءات</th></tr></thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.nameAr}</td>
                  <td><button className="delete-btn" onClick={() => handleDeleteCategory(c.id)}>حذف</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
