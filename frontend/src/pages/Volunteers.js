import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Users, Clock, CheckCircle2, XCircle, ChevronLeft, Eye } from 'lucide-react';
import api from '../api/axios';

const PURPLE = '#9b59b6';
const ORANGE = '#FF6B00';
const EMPTY = {
  name: '', email: '', phone: '',
  availability: 'Weekdays', skills: '',
  preferred_location: '', hours_contributed: 0,
  status: 'Active', joined_on: '',
};

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

function Volunteers({ isAdmin }) {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');
  const [viewVolunteer, setViewVolunteer] = useState(null);

  const fetchData = () => {
    setLoading(true);
    api.get('volunteers/').then(r => setVolunteers(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = volunteers.filter(v => (v.name || '').toLowerCase().includes(search.toLowerCase()));
  const approved = volunteers.filter(v => norm(v.approval_status) === 'approved');
  const pending  = volunteers.filter(v => norm(v.approval_status) === 'pending');
  const rejected = volunteers.filter(v => norm(v.approval_status) === 'rejected');

  const stats = [
    { label: 'Total Applications', value: volunteers.length, Icon: Users, color: PURPLE },
    { label: 'Pending', value: pending.length, Icon: Clock, color: '#b28704' },
    { label: 'Approved', value: approved.length, Icon: CheckCircle2, color: '#1e8e4a' },
    { label: 'Rejected', value: rejected.length, Icon: XCircle, color: '#e53935' },
  ];

  const openAdd   = () => { setForm(EMPTY); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(EMPTY); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.joined_on) { alert('Please fill all required fields.'); return; }
    setSaving(true);
    try {
      await api.post('volunteers/', form);
      fetchData();
      closeForm();
    } catch { alert('Error saving volunteer.'); }
    finally { setSaving(false); }
  };

  const handleReview = async (id, action) => {
    if (action === 'reject' && !window.confirm('Reject this volunteer?')) return;
    try { await api.patch(`volunteers/${id}/review/`, { action }); fetchData(); }
    catch { alert('Error updating volunteer status.'); }
  };

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
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#999' }}>Dashboard › Volunteers</p>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>Volunteer Management</h2>
        </div>
        {isAdmin && (
          <button onClick={openAdd} style={pillBtn(PURPLE)}>
            <Plus size={16} /> Add Volunteer
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

      {/* Volunteer applications */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f4f4f4' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Volunteer Applications</h3>
        </div>
        {loading ? (
          <p style={{ padding: 20, color: '#888' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: 20, color: '#aaa' }}>No volunteers found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                  <th style={th}>#</th><th style={th}>Name</th><th style={th}>Email</th>
                  <th style={th}>Applied On</th><th style={th}>Status</th>
                  {isAdmin && <th style={th}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const status = norm(v.approval_status);
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                      <td style={td}>{i + 1}</td>
                      <td style={{ ...td, fontWeight: 600, color: '#333' }}>{v.name}</td>
                      <td style={td}>{v.email || '—'}</td>
                      <td style={td}>{v.joined_on ? new Date(v.joined_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td style={td}><ApprovalBadge status={status} /></td>
                      {isAdmin && (
                        <td style={td}>
                          {status === 'pending' ? (
                            <div style={{ display: 'flex', gap: 6, minWidth: 120 }}>
                              <button onClick={() => handleReview(v.id, 'approve')} style={{ ...pillBtnSm('#1e8e4a'), flex: 1 }}>Approve</button>
                              <button onClick={() => handleReview(v.id, 'reject')} style={{ ...pillBtnSm('#e53935'), flex: 1 }}>Reject</button>
                            </div>
                          ) : status === 'approved' ? (
                            <span onClick={() => setViewVolunteer(v)} style={{ color: PURPLE, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>View</span>
                          ) : (
                            <span style={{ color: '#bbb', fontSize: 12 }}>—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ padding: '14px 20px' }}>
          <span style={{ color: PURPLE, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View All Applications →</span>
        </div>
      </div>

      {/* Add Volunteer Modal */}
      {showForm && (
        <div style={overlay}>
          <div style={{ ...modal, maxWidth: 560 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Add Volunteer</h3>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Name *', name: 'name', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone *', name: 'phone', type: 'text' },
                { label: 'Preferred Location', name: 'preferred_location', type: 'text' },
                { label: 'Skills', name: 'skills', type: 'text' },
                { label: 'Hours Contributed', name: 'hours_contributed', type: 'number' },
                { label: 'Joined Date *', name: 'joined_on', type: 'date' },
              ].map(f => (
                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{f.label}</label>
                  <input type={f.type} name={f.name} value={form[f.name] || ''} onChange={handleChange}
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Availability</label>
                <select name="availability" value={form.availability} onChange={handleChange}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}>
                  <option>Weekdays</option><option>Weekends</option><option>Flexible</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Status</label>
                <select name="status" value={form.status} onChange={handleChange}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={closeForm} style={{ padding: '9px 20px', borderRadius: 999, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSubmit} disabled={saving} style={{ padding: '9px 22px', borderRadius: 999, border: 'none', background: PURPLE, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Volunteer Modal */}
      {viewVolunteer && (
        <div style={overlay}>
          <div style={{ ...modal, maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Eye size={18} color={PURPLE} /> Volunteer Details
              </h3>
              <button onClick={() => setViewVolunteer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Name', value: viewVolunteer.name },
                { label: 'Email', value: viewVolunteer.email || '—' },
                { label: 'Phone', value: viewVolunteer.phone || '—' },
                { label: 'Availability', value: viewVolunteer.availability || '—' },
                { label: 'Skills', value: viewVolunteer.skills || '—' },
                { label: 'Preferred Location', value: viewVolunteer.preferred_location || '—' },
                { label: 'Hours Contributed', value: viewVolunteer.hours_contributed ?? '—' },
                { label: 'Status', value: viewVolunteer.status || '—' },
                { label: 'Joined On', value: viewVolunteer.joined_on ? new Date(viewVolunteer.joined_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f4f4f4', paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setViewVolunteer(null)} style={{ padding: '9px 20px', borderRadius: 999, border: 'none', background: PURPLE, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const th = { padding: '12px 16px', fontSize: 11, color: '#777', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 };
const td = { padding: '13px 16px', color: '#333', fontSize: 13, verticalAlign: 'middle' };
const pillBtn = (bg) => ({ display: 'flex', alignItems: 'center', gap: 6, background: bg, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: 'pointer' });
const pillBtnSm = (bg) => ({ padding: '7px 12px', borderRadius: 999, border: 'none', background: bg, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' });
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modal = { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' };

export default Volunteers;