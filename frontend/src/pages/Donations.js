import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Wallet, Clock, CheckCircle2, XCircle, ChevronLeft, Receipt } from 'lucide-react';
import api from '../api/axios';

const EMPTY = { donor_name: '', amount: '', date: '', purpose: '', notes: '' };
const GREEN = '#1e8e4a';
const ORANGE = '#FF6B00';

const norm = (s) => (s || 'pending').toString().trim().toLowerCase();

function StatusBadge({ status }) {
  const map = {
    pending:   { bg: '#fff8e1', color: '#b28704', label: 'Pending' },
    approved:  { bg: '#e6f7ed', color: '#1e8e4a', label: 'Approved' },
    rejected:  { bg: '#ffeaea', color: '#e53935', label: 'Rejected' },
    cancelled: { bg: '#f0f0f0', color: '#888', label: 'Cancelled' },
  };
  const s = map[norm(status)] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

function Donations({ isAdmin }) {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [receiptDonation, setReceiptDonation] = useState(null);

  const fetchDonations = () => {
    setLoading(true);
    api.get('donations/').then(r => setDonations(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchDonations(); }, []);

  const approved  = donations.filter(d => norm(d.approval_status) === 'approved');
  const pending   = donations.filter(d => norm(d.approval_status) === 'pending');
  const rejected  = donations.filter(d => norm(d.approval_status) === 'rejected');
  const totalAmt  = approved.reduce((s, d) => s + parseFloat(d.amount || 0), 0);

  const stats = [
    { label: 'Total Donations', value: `₹${totalAmt.toLocaleString('en-IN')}`, Icon: Wallet, color: GREEN },
    { label: 'Pending', value: pending.length, Icon: Clock, color: '#b28704' },
    { label: 'Approved', value: approved.length, Icon: CheckCircle2, color: '#1e8e4a' },
    { label: 'Rejected', value: rejected.length, Icon: XCircle, color: '#e53935' },
  ];

  const recent = [...donations]
    .sort((a, b) => new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0))
    .slice(0, 8);

  const openAdd   = () => { setForm(EMPTY); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(EMPTY); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.donor_name || !form.amount || !form.date) { alert('Please fill all required fields.'); return; }
    setSaving(true);
    try {
      await api.post('donations/', form);
      fetchDonations();
      closeForm();
    } catch { alert('Error saving donation.'); }
    finally { setSaving(false); }
  };

  const handleReview = async (id, action) => {
    if (!window.confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this donation?`)) return;
    try { await api.patch(`donations/${id}/review/`, { action }); fetchDonations(); }
    catch { alert('Error updating donation status.'); }
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
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#999' }}>Dashboard › Donations</p>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>Donation Management</h2>
        </div>
        {isAdmin && (
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, background: GREEN, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <Plus size={16} /> Add Donation Offline
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

      {/* Donation Requests table */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f4f4f4' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Donation Requests</h3>
        </div>
        {loading ? (
          <p style={{ padding: 20, color: '#888' }}>Loading…</p>
        ) : recent.length === 0 ? (
          <p style={{ padding: 20, color: '#aaa' }}>No donations yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                  <th style={th}>#</th>
                  <th style={th}>Donor Name</th>
                  <th style={th}>Amount (₹)</th>
                  <th style={th}>Date</th>
                  <th style={th}>Status</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((d, i) => {
                  const status = norm(d.approval_status);
                  const dateStr = d.date ? new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                      <td style={td}>{i + 1}</td>
                      <td style={{ ...td, fontWeight: 600, color: '#333' }}>{d.donor_name}</td>
                      <td style={td}>{parseFloat(d.amount || 0).toLocaleString('en-IN')}</td>
                      <td style={td}>{dateStr}</td>
                      <td style={td}><StatusBadge status={status} /></td>
                      <td style={td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 120 }}>
                          {isAdmin && status === 'pending' && (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => handleReview(d.id, 'approve')} style={{ ...pillBtn(GREEN), flex: 1 }}>Approve</button>
                              <button onClick={() => handleReview(d.id, 'reject')} style={{ ...pillBtn('#e53935'), flex: 1 }}>Reject</button>
                            </div>
                          )}
                          {status === 'approved' && <span onClick={() => setReceiptDonation(d)} style={{ color: GREEN, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>View Receipt</span>}
                          {(status === 'rejected' || status === 'cancelled') && <span style={{ color: '#bbb', fontSize: 12 }}>—</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Donation Modal */}
      {showForm && (
        <div style={overlay}>
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Add Donation</h3>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
            </div>
            {[
              { label: 'Donor Name *', name: 'donor_name', type: 'text' },
              { label: 'Amount (₹) *', name: 'amount', type: 'number' },
              { label: 'Date *', name: 'date', type: 'date' },
              { label: 'Purpose', name: 'purpose', type: 'text' },
              { label: 'Notes', name: 'notes', type: 'text' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#444' }}>{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name] || ''} onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={closeForm} style={{ padding: '9px 20px', borderRadius: 999, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSubmit} disabled={saving} style={{ padding: '9px 22px', borderRadius: 999, border: 'none', background: GREEN, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                {saving ? 'Saving...' : 'Save Donation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptDonation && (
        <div style={overlay}>
          <div style={{ ...modal, maxWidth: 420 }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Receipt size={24} color={GREEN} />
              </div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>Donation Receipt</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#999' }}>NGOConnect</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px dashed #ddd', paddingTop: 16 }}>
              {[
                { label: 'Receipt No.', value: `NGC-${String(receiptDonation.id).padStart(5, '0')}` },
                { label: 'Donor Name', value: receiptDonation.donor_name },
                { label: 'Amount', value: `₹${parseFloat(receiptDonation.amount || 0).toLocaleString('en-IN')}` },
                { label: 'Date', value: receiptDonation.date ? new Date(receiptDonation.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
                { label: 'Purpose', value: receiptDonation.purpose || '—' },
                { label: 'Notes', value: receiptDonation.notes || '—' },
                { label: 'Status', value: 'Approved' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 700, textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => window.print()} style={{ padding: '9px 18px', borderRadius: 999, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Print</button>
              <button onClick={() => setReceiptDonation(null)} style={{ padding: '9px 22px', borderRadius: 999, border: 'none', background: GREEN, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const th = { padding: '12px 16px', fontSize: 11, color: '#777', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 };
const td = { padding: '13px 16px', color: '#333', fontSize: 13, verticalAlign: 'middle' };
const pillBtn = (bg) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 14px', borderRadius: 999, border: 'none', background: bg, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' });
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modal = { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' };

export default Donations;