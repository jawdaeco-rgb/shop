import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, addToCart } from '../api';
import { getProductImage, getCategoryImage } from '../utils';

export default function Home({ user, refreshCart }) {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getProducts({ featured: '1' }).then(setFeatured).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
  }, []);

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
    <>
      <section className="hero">
        <div className="container">
          <h1>تسوقي <span>أناقتك</span> المثالية</h1>
          <p>أحدث صيحات الموضة وأجمل العطور في مكان واحد. اكتشفي تشكيلتنا المميزة.</p>
          <Link to="/products" className="btn btn-primary">تسوق الآن</Link>
        </div>
      </section>

      <section className="container">
        <div className="section-title">
          <h2>التصنيفات</h2>
          <p>تصفحي حسب ما يناسبك</p>
        </div>
        <div className="categories">
          {categories.map((cat) => (
            <Link to={`/products?category=${cat.id}`} key={cat.id} className="category-card">
              <div className="cat-icon" style={{ backgroundImage: `url(${getCategoryImage(cat.id)})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }} />
              <h3>{cat.nameAr}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-title">
          <h2>المنتجات المميزة</h2>
          <p>اختياراتنا لكِ</p>
        </div>
        <div className="product-grid">
          {featured.map(p => (
            <Link to={`/products/${p.id}`} key={p.id} className="product-card">
              <div className="img-wrap">
                <img src={getProductImage(p)} alt={p.nameAr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span className="badge-featured">مميز</span>
                {p.oldPrice && <span className="discount">-{Math.round((1 - p.price/p.oldPrice) * 100)}%</span>}
              </div>
              <div className="info">
                <div className="stars">{'★'.repeat(Math.round(p.rating))} {p.rating}</div>
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
      </section>
    </>
  );
}
