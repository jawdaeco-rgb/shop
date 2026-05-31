import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(form.email, form.password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/');
    } catch (e) {
      setError(e.message || 'بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>تسجيل الدخول</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label>البريد الإلكتروني</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>كلمة المرور</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button type="submit" className="btn btn-primary">دخول</button>
        <div className="link">
          ليس لديك حساب؟ <Link to="/register">سجلي الآن</Link>
        </div>
      </form>
    </div>
  );
}
