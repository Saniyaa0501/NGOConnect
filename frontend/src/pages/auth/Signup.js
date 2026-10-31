import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm_password: '', role: 'user', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password || !form.confirm_password) return setError('Fill all required fields');
    if (form.password !== form.confirm_password) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      const res = await api.post('auth/register/', form);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.username?.[0] || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}> NGOConnect</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Join NGOConnect today</p>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input style={styles.input} name="username" placeholder="Enter full name" value={form.username} onChange={handleChange} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input style={styles.input} name="email" type="email" placeholder="Enter email" value={form.email} onChange={handleChange} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password *</label>
            <input style={styles.input} name="password" type="password" placeholder="Enter password" value={form.password} onChange={handleChange} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password *</label>
            <input style={styles.input} name="confirm_password" type="password" placeholder="Confirm password" value={form.confirm_password} onChange={handleChange} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input style={styles.input} name="phone" placeholder="Enter phone" value={form.phone} onChange={handleChange} />
          </div>
          
        </div>
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <p style={styles.link}>Already have an account? <Link to="/login" style={styles.a}>Sign In</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a1a 0%, #FF6B00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: 'white', borderRadius: 16, padding: '40px', width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  logo: { fontSize: 24, fontWeight: 700, color: '#FF6B00', marginBottom: 20, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: 700, margin: '0 0 8px', textAlign: 'center', color: '#1a1a1a' },
  sub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 28 },
  error: { background: '#fde8e8', color: '#e74c3c', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  formGroup: { marginBottom: 4 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #1a1a1a, #FF6B00)', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 20 },
  link: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' },
  a: { color: '#FF6B00', fontWeight: 600, textDecoration: 'none' },
};

export default Signup;