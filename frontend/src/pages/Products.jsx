import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, addToCart } from '../api';
import { getProductImage } from '../utils';

export default function Products({ user, refreshCart }) {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (categoryFilter) params.category = categoryFilter;
    if (searchQuery) params.search = searchQuery;
    getProducts(params).then(setProducts).catch(() => {}).finally(() => setLoading(false));
  }, [categoryFilter, searchQuery]);

  const handleAdd = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await addToCart(id);
      refreshCart();
      alert('✓ تمت الإضافة إلى السلة');
    } catch { alert('يرجى تسجيل الدخول أولاً'); }
  };

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 30 }}>
      <h1 style={{ marginBottom: 20 }}>المنتجات</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 25, flexWrap: 'wrap' }}>
        <Link to="/products" className={`btn ${!categoryFilter ? 'btn-primary' : 'btn-outline'} btn-sm`}>الكل</Link>
        {categories.map(c => (
          <Link key={c.id} to={`/products?category=${c.id}`}
            className={`btn btn-sm ${categoryFilter === String(c.id) ? 'btn-primary' : 'btn-outline'}`}>
            {c.nameAr}
          </Link>
        ))}
      </div>

      {loading ? <div className="loading"><div className="spinner" /></div> : products.length === 0 ? (
        <div className="empty-cart">
          <div className="icon">🔍</div>
          <p>لا توجد منتجات متاحة</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <Link to={`/products/${p.id}`} key={p.id} className="product-card">
              <div className="img-wrap">
                <img src={getProductImage(p)} alt={p.nameAr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {p.isFeatured ? <span className="badge-featured">مميز</span> : null}
                {p.oldPrice && <span className="discount">-{Math.round((1 - p.price/p.oldPrice) * 100)}%</span>}
              </div>
              <div className="info">
                <div className="stars">{'★'.repeat(Math.round(p.rating))}</div>
                <h3>{p.nameAr}</h3>
                <div className="price">
                  <span className="current">{p.price} د.م.</span>
                  {p.oldPrice && <span className="old">{p.oldPrice} د.م.</span>}
                </div>
                <button className="add-btn" onClick={(e) => handleAdd(e, p.id)}>
                  + أضف إلى السلة
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
