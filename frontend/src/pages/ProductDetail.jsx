import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, addToCart } from '../api';
import { getProductImage } from '../utils';

export default function ProductDetail({ user, refreshCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProduct(id).then(setProduct).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) return alert('يرجى تسجيل الدخول أولاً');
    try {
      await addToCart(Number(id), qty);
      refreshCart();
      alert(`✓ تمت إضافة ${qty} قطعة إلى السلة`);
    } catch { alert('حدث خطأ'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!product) return <div className="loading">المنتج غير موجود</div>;

  return (
    <div className="container">
      <div className="product-detail">
        <div className="gallery">
          <div className="main-img" style={{ overflow: 'hidden', padding: 0 }}>
            <img src={getProductImage(product, 600)} alt={product.nameAr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <div className="info">
          <span className="cat-badge">{product.categoryNameAr || product.categoryName}</span>
          <h1>{product.nameAr}</h1>
          <div className="stars">{'★'.repeat(Math.round(product.rating))} {product.rating}</div>
          <p className="desc">{product.descriptionAr || product.description}</p>
          <div className="price-row">
            <span className="current">{product.price} د.م.</span>
            {product.oldPrice && <span className="old">{product.oldPrice} د.م.</span>}
          </div>
          <div className="qty">
            <span>الكمية:</span>
            <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
          </div>
          <button className="btn btn-primary" onClick={handleAdd} style={{ width: '100%' }}>
            🛒 أضف إلى السلة
          </button>
          <Link to="/products" className="btn btn-outline" style={{ width: '100%', marginTop: 10, textAlign: 'center' }}>
            ← العودة للمنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
