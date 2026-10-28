import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Users, Baby, PersonStanding, HeartHandshake, Trash2, ChevronLeft } from 'lucide-react';
import api from '../api/axios';

const ORANGE = '#FF6B00';
const EMPTY = { name: '', age: '', gender: 'Male', contact: '', address: '', support_type: 'Food', priority_score: 0 };

const norm = (s) => (s || 'pending').toString().trim().toLowerCase();

function ApprovalBadge({ status }) {
  const map = {
    pending:  { bg: '#fff8e1', color: '#b28704', label: 'Pending' },
    approved: { bg: '#e6f7ed', color: '#1e8e4a', label: 'Approved' },
    rejected: { bg: '#ffeaea', color: '#e53935', label: 'Rejected' },
  };
  const s = map[norm(status)] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

function PriorityBadge({ score }) {
  const s = Number(score) || 0;
  const map = s >= 70
    ? { bg: '#ffeaea', color: '#e53935', label: `High (${s})` }
    : s >= 40
      ? { bg: '#fff8e1', color: '#b28704', label: `Medium (${s})` }
      : { bg: '#e6f7ed', color: '#1e8e4a', label: `Low (${s})` };
  return (
    <span style={{ background: map.bg, color: map.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {map.label}
    </span>
  );
}

function getCategory(b) {
  const age = Number(b.age) || 0;
  if (age < 18) return 'Children';
  if (age >= 60) return 'Elderly';
  return b.gender === 'Female' ? 'Women' : b.gender === 'Male' ? 'Men' : 'Other';
}

function Beneficiaries({ isAdmin }) {
  const navigate = useNavigate();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchData = () => {
    setLoading(true);
    api.get('beneficiaries/').then(r => setBeneficiaries(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.age || !form.contact) return alert('Fill required fields!');
    const payload = editId ? form : { ...form, approval_status: 'approved' };
    const req = editId ? api.put(`beneficiaries/${editId}/`, payload) : api.post('beneficiaries/', payload);
    req.then(() => { fetchData(); closeForm(); });
  };

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(EMPTY); setEditId(null); };
  const handleEdit = b => { setForm(b); setEditId(b.id); setShowForm(true); };
  const handleDelete = (id) => { api.delete(`beneficiaries/${id}/`).then(() => { setDeleteId(null); fetchData(); }); };
  const handleReview = (id, action) => {
    if (action === 'reject' && !window.confirm('Reject this beneficiary application?')) return;
    api.patch(`beneficiaries/${id}/review/`, { action }).then(fetchData);
  };

  const filtered = beneficiaries.filter(b => (b.name || '').toLowerCase().includes(search.toLowerCase()));
  const counts = beneficiaries.reduce((acc, b) => {
    const cat = getCategory(b);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: 'Total Beneficiaries', value: beneficiaries.length, Icon: Users, color: ORANGE },
    { label: 'Children', value: counts['Children'] || 0, Icon: Baby, color: ORANGE },
    { label: 'Women', value: counts['Women'] || 0, Icon: PersonStanding, color: ORANGE },
    { label: 'Elderly', value: counts['Elderly'] || 0, Icon: HeartHandshake, color: ORANGE },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>

      {/* Back button */}
      <button
        onClick={() => navigate('/admin/dashboard')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#fff', border: '1px solid #FF6B00', color: '#FF6B00',
          fontWeight: 700, fontSize: 13, cursor: 'pointer',
          padding: '8px 16px', borderRadius: 999, marginBottom: 18,
        }}
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#999' }}>Dashboard › Beneficiaries</p>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>Beneficiary Management</h2>
        </div>
        {isAdmin && (
          <button onClick={openAdd} style={pillBtn(ORANGE)}>
            <Plus size={16} /> Add Beneficiary
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 22 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 12, padding: '18px 18px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', border: '1px solid #e8e8e8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.Icon size={18} color={s.color} strokeWidth={2.3} />
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#555', fontWeight: 600 }}>{s.label}</p>
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1a1a1a' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 320, padding: '9px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
      </div>

      {/* Beneficiary list */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f4f4f4' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Beneficiary List</h3>
        </div>
        {loading ? (
          <p style={{ padding: 20, color: '#888' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: 20, color: '#aaa' }}>No beneficiaries yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                  <th style={th}>#</th><th style={th}>Name</th><th style={th}>Age</th>
                  <th style={th}>Category</th><th style={th}>Priority</th>
                  {isAdmin && <th style={th}>Approval</th>}
                  {isAdmin && <th style={th}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                    <td style={td}>{i + 1}</td>
                    <td style={{ ...td, fontWeight: 600, color: '#333' }}>{b.name}</td>
                    <td style={td}>{b.age}</td>
                    <td style={td}>{getCategory(b)}</td>
                    <td style={td}><PriorityBadge score={b.priority_score} /></td>
                    {isAdmin && <td style={td}><ApprovalBadge status={b.approval_status} /></td>}
                    {isAdmin && (
                      <td style={td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 150 }}>
                          {norm(b.approval_status) === 'pending' && (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => handleReview(b.id, 'approve')} style={{ ...pillBtnSm('#1e8e4a'), flex: 1 }}>Approve</button>
                              <button onClick={() => handleReview(b.id, 'reject')} style={{ ...pillBtnSm('#e53935'), flex: 1 }}>Reject</button>
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleEdit(b)} style={{ ...pillBtnSm(ORANGE), flex: 1 }}>Edit</button>
                            <button onClick={() => setDeleteId(b.id)} style={{ ...pillBtnSm('#e53935'), flex: 1 }}>Delete</button>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={overlay}>
          <div style={{ ...modal, maxWidth: 560 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{editId ? 'Edit Beneficiary' : 'Add Beneficiary'}</h3>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Name *" name="name" value={form.name} onChange={handleChange} />
              <Field label="Age *" name="age" type="number" value={form.age} onChange={handleChange} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={lbl}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <Field label="Contact *" name="contact" value={form.contact} onChange={handleChange} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={lbl}>Support Type</label>
                <select name="support_type" value={form.support_type} onChange={handleChange} style={inputStyle}>
                  <option>Food</option><option>Education</option><option>Medical</option><option>Other</option>
                </select>
              </div>
              <Field label="Priority Score (0-100)" name="priority_score" type="number" value={form.priority_score} onChange={handleChange} />
              <div style={{ gridColumn: 'span 2' }}>
                <Field label="Address" name="address" value={form.address} onChange={handleChange} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={closeForm} style={{ padding: '9px 20px', borderRadius: 999, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSubmit} style={{ padding: '9px 22px', borderRadius: 999, border: 'none', background: ORANGE, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                {editId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={overlay}>
          <div style={{ ...modal, maxWidth: 360, textAlign: 'center' }}>
            <Trash2 size={36} color="#e53935" style={{ marginBottom: 12 }} />
            <h3 style={{ margin: '0 0 8px' }}>Delete Beneficiary?</h3>
            <p style={{ color: '#888', marginBottom: 20 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: '9px 20px', borderRadius: 999, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ padding: '9px 20px', borderRadius: 999, border: 'none', background: '#e53935', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            </div>
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
      <input type={type} name={name} value={value || ''} onChange={onChange} style={inputStyle} />
    </div>
  );
}

const lbl = { fontSize: 13, fontWeight: 600, color: '#444' };
const inputStyle = { padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', outline: 'none' };
const th = { padding: '12px 16px', fontSize: 11, color: '#777', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 };
const td = { padding: '13px 16px', color: '#333', fontSize: 13, verticalAlign: 'middle' };
const pillBtn = (bg) => ({ display: 'flex', alignItems: 'center', gap: 6, background: bg, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: 'pointer' });
const pillBtnSm = (bg) => ({ padding: '7px 12px', borderRadius: 999, border: 'none', background: bg, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' });
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modal = { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' };

export default Beneficiaries;