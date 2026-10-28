import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, List, HeartHandshake, X, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../api/axios';

const EMPTY_FORM = { name: '', age: '', gender: 'Male', contact: '', address: '', support_type: 'Food' };

function UserBeneficiaries() {
  const [allBeneficiaries, setAllBeneficiaries] = useState([]);

  // Request Support form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fetchData = () => {
    api.get('beneficiaries/').then(r => setAllBeneficiaries(r.data)).catch(() => {});
  };
  useEffect(() => { fetchData(); }, []);

  // Only approved beneficiaries should count as "Lives Impacted" publicly
  const beneficiaries = allBeneficiaries.filter(b => b.approval_status === 'approved');

  const getPriorityBadge = score => {
    if (score >= 70) return <span className="badge badge-high">High Need</span>;
    if (score >= 40) return <span className="badge badge-medium">Medium Need</span>;
    return <span className="badge badge-low">Low Need</span>;
  };

  const openForm = () => { setForm(EMPTY_FORM); setSubmitted(false); setError(''); setShowForm(true); };
  const closeForm = () => { setShowForm(false); };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.age || !form.contact) {
      setError('Please fill in Name, Age, and Contact — these are required.');
      return;
    }
    setSubmitting(true);
    // Requests submitted by a logged-in user always start as pending — an admin must review and approve.
    api.post('beneficiaries/', { ...form, approval_status: 'pending' })
      .then(() => { setSubmitted(true); fetchData(); })
      .catch(() => setError('Something went wrong submitting your request. Please try again.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #2ecc71)', borderRadius: 14, padding: '24px 32px', marginBottom: 24, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Lives Impacted</h2>
          <p style={{ fontSize: 14, opacity: 0.8, marginTop: 6, margin: '6px 0 0' }}>People whose lives are being changed through your support.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={openForm}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1a1a1a', border: 'none', padding: '10px 18px', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          >
            <HeartHandshake size={16} color="#FF6B00" /> Request Support
          </button>
          <Users size={44} color="white" style={{ opacity: 0.85 }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ borderTop: '4px solid #FF6B00', margin: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#FF6B00' }}>{beneficiaries.length}</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Total Beneficiaries</div>
        </div>
        <div className="card" style={{ borderTop: '4px solid #e74c3c', margin: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#e74c3c' }}>{beneficiaries.filter(b => b.priority_score >= 70).length}</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>High Priority</div>
        </div>
        <div className="card" style={{ borderTop: '4px solid #2ecc71', margin: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#2ecc71' }}>{[...new Set(beneficiaries.map(b => b.support_type))].length}</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Support Categories</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 38, height: 38, background: '#e8f8f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <List size={18} color="#2ecc71" />
          </div>
          <h3 style={{ margin: 0, color: '#2ecc71' }}>Beneficiary List</h3>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', background: '#f0f0f0', padding: '4px 10px', borderRadius: 12 }}>
            <ShieldCheck size={13} /> Contact info hidden for privacy
          </span>
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Support Type</th><th>Priority</th></tr>
          </thead>
          <tbody>
            {beneficiaries.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>No data available</td></tr>
            ) : beneficiaries.map((b, i) => (
              <tr key={b.id}>
                <td>{i + 1}</td>
                <td>{b.name}</td>
                <td>{b.age}</td>
                <td>{b.gender}</td>
                <td>{b.support_type}</td>
                <td>{getPriorityBadge(b.priority_score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Request Support modal */}
      {showForm && (
        <div style={overlay}>
          <div className="card" style={{ maxWidth: 520, width: '100%', padding: 28, margin: 0 }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '12px 8px' }}>
                <CheckCircle2 size={44} color="#2ecc71" style={{ marginBottom: 14 }} />
                <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Request submitted</h3>
                <p style={{ color: '#888', margin: '0 0 20px', fontSize: 14 }}>
                  Your application has been received and is pending review. Our team will follow up using the contact details you provided.
                </p>
                <button onClick={closeForm} style={{ padding: '9px 20px', borderRadius: 999, border: 'none', background: '#FF6B00', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Request Support</h3>
                  <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Full Name *" name="name" value={form.name} onChange={handleChange} />
                    <Field label="Age *" name="age" type="number" value={form.age} onChange={handleChange} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={lbl}>Gender</label>
                      <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <Field label="Contact Number *" name="contact" value={form.contact} onChange={handleChange} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={lbl}>Support Type</label>
                      <select name="support_type" value={form.support_type} onChange={handleChange} style={inputStyle}>
                        <option>Food</option><option>Education</option><option>Medical</option><option>Other</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <Field label="Address" name="address" value={form.address} onChange={handleChange} />
                    </div>
                  </div>

                  {error && <p style={{ color: '#e53935', fontSize: 13, marginTop: 14 }}>{error}</p>}

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                    <button type="button" onClick={closeForm} style={{ padding: '9px 20px', borderRadius: 999, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancel</button>
                    <button
                      type="submit" disabled={submitting}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 22px', borderRadius: 999, border: 'none', background: submitting ? '#ffb680' : '#FF6B00', color: '#fff', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14 }}
                    >
                      {submitting && <Loader2 size={16} />}
                      {submitting ? 'Submitting…' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={lbl}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} style={inputStyle} />
    </div>
  );
}

const lbl = { fontSize: 13, fontWeight: 600, color: '#444' };
const inputStyle = { padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', outline: 'none' };
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 };

export default UserBeneficiaries;
