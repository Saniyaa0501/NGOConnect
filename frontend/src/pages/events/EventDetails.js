import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Check, Calendar, MapPin, Clock, Wallet, Receipt, PieChart } from 'lucide-react';
import api from '../../api/axios';

const EMPTY_EXPENSE = { name: '', category: 'Venue', amount: '' };
const CATEGORIES = ['Venue', 'Food', 'Materials', 'Transport', 'Other'];

const CATEGORY_STYLES = {
  Venue: { bg: '#e3f2fd', color: '#1565c0' },
  Food: { bg: '#e8f5ee', color: '#1e8e4a' },
  Materials: { bg: '#ede7f6', color: '#5e35b1' },
  Transport: { bg: '#fff3e0', color: '#e65100' },
  Other: { bg: '#f1f1f1', color: '#555' },
};

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_EXPENSE);
  const [saving, setSaving] = useState(false);

  const fetchEvent = () => {
    setLoading(true);
    api.get(`events/${id}/`)
      .then(r => { setEvent(r.data); setError(''); })
      .catch(() => setError('Failed to load event.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvent(); }, [id]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.amount) {
      alert('Please fill all required fields.'); return;
    }
    setSaving(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await api.post('expenses/', { ...form, date: today, event: Number(id), amount: Number(form.amount) });
      fetchEvent();
      setShowForm(false);
      setForm(EMPTY_EXPENSE);
    } catch {
      alert('Error saving expense.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading event...</div>;
  if (error || !event) return (
    <div style={{ padding: 24 }}>
      <button onClick={() => navigate('/admin/events')} style={backBtn}><ArrowLeft size={16} /> Back to Events</button>
      <p style={{ color: 'red' }}>{error || 'Event not found.'}</p>
    </div>
  );

  const expenses = event.expenses || [];
  const spent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const budget = Number(event.budget || 0);
  const remaining = Math.max(0, budget - spent);
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  return (
    <div style={{ padding: '24px' }}>
      <button onClick={() => navigate('/admin/events')} style={backBtn}><ArrowLeft size={16} /> Back to Events</button>

      {/* Event details card */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: 24, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ width: 260, height: 200, background: event.image ? `url(${event.image}) center/cover` : '#f0f0f0', flexShrink: 0 }} />
        <div style={{ padding: 20, flex: 1, minWidth: 240 }}>
          <h2 style={{ margin: '0 0 8px' }}>{event.title}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: '#666', fontSize: 14, marginBottom: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> {event.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> {event.time}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> {event.location}</span>
          </div>
          <p style={{ color: '#444', fontSize: 14 }}>{event.description}</p>
        </div>
      </div>

      {/* Budget & expenses */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 16px' }}>Budget & Expenses</h3>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
          <div style={{ ...statCard, background: '#fff4ea' }}>
            <div style={{ ...statIcon, background: '#FF6B00' }}><Wallet size={18} color="#fff" /></div>
            <div>
              <div style={statLabel}>Total Budget</div>
              <div style={statValue}>₹{budget.toLocaleString()}</div>
              <div style={statSub}>Allocated budget for this event</div>
            </div>
          </div>
          <div style={{ ...statCard, background: '#e8f5ee' }}>
            <div style={{ ...statIcon, background: '#1e8e4a' }}><Receipt size={18} color="#fff" /></div>
            <div>
              <div style={statLabel}>Amount Utilized</div>
              <div style={statValue}>₹{spent.toLocaleString()}</div>
              <div style={statSub}>Total amount spent</div>
            </div>
          </div>
          <div style={{ ...statCard, background: '#2b2b2b' }}>
            <div style={{ ...statIcon, background: '#FF6B00' }}><PieChart size={18} color="#fff" /></div>
            <div>
              <div style={{ ...statLabel, color: '#ccc' }}>Remaining Balance</div>
              <div style={{ ...statValue, color: '#fff' }}>₹{remaining.toLocaleString()}</div>
              <div style={{ ...statSub, color: '#999' }}>Balance amount remaining</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Budget Utilization</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: pct >= 100 ? '#e53935' : '#1e8e4a' }}>{pct}% utilized</span>
        </div>
        <div style={{ height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#e53935' : '#FF6B00' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
          <h4 style={{ margin: 0 }}>Expense Breakdown</h4>
          <button onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF6B00', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={16} /> Add Expense
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={th}>#</th>
                <th style={th}>Item</th>
                <th style={th}>Category</th>
                <th style={{ ...th, textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: '#888' }}>No expenses logged yet.</td></tr>
              ) : expenses.map((exp, i) => {
                const catStyle = CATEGORY_STYLES[exp.category] || CATEGORY_STYLES.Other;
                return (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}>{exp.name}</td>
                    <td style={td}>
                      <span style={{ background: catStyle.bg, color: catStyle.color, padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>₹{parseFloat(exp.amount).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
            {expenses.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ ...td, fontWeight: 700, borderTop: '2px solid #eee' }}>Total Expenses</td>
                  <td style={{ ...td, fontWeight: 700, textAlign: 'right', borderTop: '2px solid #eee' }}>₹{spent.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showForm && (
        <div style={overlay}>
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>Add Expense</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Item *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Community Hall Rent" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Amount (₹) *</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setShowForm(false)}
                style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={saving}
                style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#FF6B00', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={15} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const th = { padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' };
const td = { padding: '10px 14px', color: '#333', verticalAlign: 'middle' };
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modal = { background: '#fff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' };
const backBtn = { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#FF6B00', fontWeight: 600, cursor: 'pointer', marginBottom: 20, padding: 0, fontSize: 14 };
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 };
const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' };
const statCard = { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px', borderRadius: 10 };
const statIcon = { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const statLabel = { fontSize: 13, color: '#555', fontWeight: 600 };
const statValue = { fontSize: 20, fontWeight: 700, color: '#222', margin: '2px 0' };
const statSub = { fontSize: 11, color: '#888' };

export default EventDetails;