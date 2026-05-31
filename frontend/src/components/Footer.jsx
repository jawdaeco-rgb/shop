import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid">
          <div>
            <h3>💎 أناقة</h3>
            <p>متجرك المفضل لشراء الملابس والعطور الفاخرة. نقدم لك أفضل المنتجات بأفضل الأسعار.</p>
          </div>
          <div>
            <h3>روابط سريعة</h3>
            <ul>
              <li><Link to="/">الرئيسية</Link></li>
              <li><Link to="/products">المنتجات</Link></li>
              <li><Link to="/products?category=1">ملابس</Link></li>
              <li><Link to="/products?category=2">عطور</Link></li>
            </ul>
          </div>
          <div>
            <h3>تواصل معنا</h3>
            <ul>
              <li>📧 info@anagha.shop</li>
              <li>📞 +966 50 000 0000</li>
              <li>📍 الرياض، المملكة العربية السعودية</li>
            </ul>
          </div>
        </div>
        <div className="bottom">
          © 2024 أناقة. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
