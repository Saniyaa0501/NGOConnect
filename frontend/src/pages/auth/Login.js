import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [fpForm, setFpForm] = useState({ email: '', new_password: '', confirm_password: '' });
  const [fpError, setFpError] = useState('');
  const [fpSuccess, setFpSuccess] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFpChange = e => setFpForm({ ...fpForm, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError('Fill all fields');
    setLoading(true); setError('');
    try {
      const res = await api.post('auth/login/', form);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      if (res.data.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/user/dashboard');
    } catch {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!fpForm.email || !fpForm.new_password || !fpForm.confirm_password) return setFpError('Fill all fields');
    if (fpForm.new_password !== fpForm.confirm_password) return setFpError('Passwords do not match');
    if (fpForm.new_password.length < 6) return setFpError('Password must be at least 6 characters');
    setFpLoading(true); setFpError(''); setFpSuccess('');
    try {
      await api.post('auth/forgot-password/', { email: fpForm.email, new_password: fpForm.new_password });
      setFpSuccess('Password reset successful! You can now login.');
      setFpForm({ email: '', new_password: '', confirm_password: '' });
      setTimeout(() => { setMode('login'); setFpSuccess(''); }, 2000);
    } catch (err) {
      setFpError(err.response?.data?.error || 'No account found with this email');
    }
    setFpLoading(false);
  };

  if (mode === 'forgot') return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>NGOConnect</div>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.sub}>Enter your email and set a new password</p>
        {fpError && <div style={styles.error}>{fpError}</div>}
        {fpSuccess && <div style={styles.success}>{fpSuccess}</div>}
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} name="email" type="email" placeholder="Enter your email" value={fpForm.email} onChange={handleFpChange} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>New Password</label>
          <input style={styles.input} name="new_password" type="password" placeholder="Enter new password" value={fpForm.new_password} onChange={handleFpChange} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Confirm Password</label>
          <input style={styles.input} name="confirm_password" type="password" placeholder="Confirm new password" value={fpForm.confirm_password} onChange={handleFpChange} />
        </div>
        <button style={styles.btn} onClick={handleForgot} disabled={fpLoading}>
          {fpLoading ? 'Resetting...' : 'Reset Password'}
        </button>
        <p style={styles.link}>
          <span onClick={() => { setMode('login'); setFpError(''); }} style={styles.a}>Back to Login</span>
        </p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>NGOConnect</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Sign in to your account</p>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input style={styles.input} name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
        </div>
        <div style={{ textAlign: 'right', marginTop: 6, marginBottom: 4 }}>
          <span onClick={() => { setMode('forgot'); setError(''); }} style={{ ...styles.a, fontSize: 13, cursor: 'pointer' }}>
            Forgot Password?
          </span>
        </div>
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p style={styles.link}>Don't have an account? <Link to="/signup" style={styles.a}>Sign Up</Link></p>
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
  success: { background: '#e6f7ed', color: '#1e8e4a', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  formGroup: { marginBottom: 14 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #1a1a1a, #FF6B00)', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 20 },
  link: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' },
  a: { color: '#FF6B00', fontWeight: 600, textDecoration: 'none' },
};

export default Login;