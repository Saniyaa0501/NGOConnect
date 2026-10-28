import React, { useState, useEffect } from 'react';
import { HeartHandshake, Target, TrendingUp, Users, ClipboardList, CheckCircle2, ClipboardCheck } from 'lucide-react';
import api from '../api/axios';

const emptyForm = { name: '', email: '', phone: '', availability: 'Weekdays', skills: '', preferred_location: '', joined_on: '' };

const statusLabel = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
};

function UserVolunteer() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [form, setForm] = useState({ ...emptyForm, name: user.username || '', email: user.email || '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [myRegistration, setMyRegistration] = useState(null);

  const fetchMyRegistration = () => {
    api.get('volunteers/').then(r => {
      const matchKey = user.email || form.email;
      const mine = r.data
        .filter(v => (matchKey ? v.email === matchKey : v.name === (user.username || form.name)))
        .sort((a, b) => b.id - a.id);
      setMyRegistration(mine[0] || null);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchMyRegistration();
}, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.joined_on) return setError('Fill required fields!');
    setError('');
    api.post('volunteers/', { ...form, status: 'Active', hours_contributed: 0 })
      .then(() => { setSubmitted(true); fetchMyRegistration(); })
      .catch(() => setError('Something went wrong. Try again.'));
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #3498db)', borderRadius: 14, padding: '24px 32px', marginBottom: 24, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Join as Volunteer</h2>
          <p style={{ fontSize: 14, opacity: 0.8, marginTop: 6, margin: '6px 0 0' }}>Your time and skills can change someone's life.</p>
        </div>
        <HeartHandshake size={44} color="white" style={{ opacity: 0.85 }} />
      </div>

      {/* Why Volunteer Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ borderTop: '4px solid #FF6B00', margin: 0, textAlign: 'center' }}>
          <Target size={30} color="#FF6B00" style={{ marginBottom: 8 }} />
          <h4 style={{ margin: '0 0 6px', color: '#1a1a1a' }}>Make an Impact</h4>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Directly help communities in need around Mumbai.</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid #3498db', margin: 0, textAlign: 'center' }}>
          <TrendingUp size={30} color="#3498db" style={{ marginBottom: 8 }} />
          <h4 style={{ margin: '0 0 6px', color: '#1a1a1a' }}>Gain Experience</h4>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Build skills while contributing to a meaningful cause.</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid #2ecc71', margin: 0, textAlign: 'center' }}>
          <Users size={30} color="#2ecc71" style={{ marginBottom: 8 }} />
          <h4 style={{ margin: '0 0 6px', color: '#1a1a1a' }}>Join a Community</h4>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Connect with like-minded volunteers across the city.</p>
        </div>
      </div>

      {/* Form - only show if not already registered */}
      {!myRegistration && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 38, height: 38, background: '#eaf4fd', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={18} color="#3498db" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#3498db' }}>Registration Form</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#888', marginTop: 3 }}>Fill in your details to get started</p>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '16px 0' }} />

          {submitted ? (
            <div style={{ background: '#eaf4fd', border: '1px solid #3498db', color: '#2980b9', padding: '24px', borderRadius: 10, textAlign: 'center' }}>
              <CheckCircle2 size={44} style={{ marginBottom: 10 }} />
              <h3 style={{ margin: '0 0 6px' }}>You're In!</h3>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>Your volunteer registration was successful. Our team will reach out to you soon!</p>
            </div>
          ) : (
            <>
              {error && <div style={{ background: '#fde8e8', color: '#e74c3c', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
              <div className="form-grid">
                <div className="form-group"><label>Full Name *</label><input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" /></div>
                <div className="form-group"><label>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email" /></div>
                <div className="form-group"><label>Phone *</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" /></div>
                <div className="form-group">
                  <label>Availability</label>
                  <select name="availability" value={form.availability} onChange={handleChange}>
                    <option>Weekdays</option><option>Weekends</option><option>Flexible</option>
                  </select>
                </div>
                <div className="form-group"><label>Skills</label><input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Teaching, Coding, Medical" /></div>
                <div className="form-group"><label>Preferred Location</label><input name="preferred_location" value={form.preferred_location} onChange={handleChange} placeholder="Enter location" /></div>
                <div className="form-group"><label>Available From *</label><input name="joined_on" type="date" value={form.joined_on} onChange={handleChange} /></div>
              </div>
              <div className="form-actions" style={{ marginTop: 24 }}>
                <button className="btn btn-primary" onClick={handleSubmit} style={{ padding: '10px 28px', fontSize: 15 }}>Submit Registration</button>
              </div>
            </>
          )}
        </div>
      )}

      {myRegistration && (
        <div className="card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, background: '#eaf4fd', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardCheck size={18} color="#3498db" />
            </div>
            <h3 style={{ margin: 0, color: '#3498db' }}>My Registration Status</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Submitted on {myRegistration.joined_on}</p>
            <span className={`badge badge-${myRegistration.approval_status}`}>
              {statusLabel[myRegistration.approval_status] || myRegistration.approval_status}
            </span>
          </div>
          {myRegistration.approval_status === 'pending' && (
            <p style={{ margin: '12px 0 0', fontSize: 13, color: '#888' }}>Our team is reviewing your registration. We'll be in touch soon!</p>
          )}
          {myRegistration.approval_status === 'rejected' && (
            <p style={{ margin: '12px 0 0', fontSize: 13, color: '#888' }}>Your registration wasn't approved this time. Contact us if you'd like to know more.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserVolunteer;