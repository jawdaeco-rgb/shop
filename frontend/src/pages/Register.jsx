import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await register(form.name, form.email, form.password, form.phone);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/');
    } catch (e) {
      setError(e.message || 'حدث خطأ');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>إنشاء حساب جديد</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label>الاسم</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>البريد الإلكتروني</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>كلمة المرور</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>رقم الجوال (اختياري)</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary">تسجيل</button>
        <div className="link">
          لديك حساب بالفعل؟ <Link to="/login">دخول</Link>
        </div>
      </form>
    </div>
  );
}
