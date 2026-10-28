import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Check, Calendar, MapPin, Clock, ChevronLeft } from 'lucide-react';
import api from '../../api/axios';

const ORANGE = '#FF6B00';
const EMPTY = { title: '', date: '', time: '', location: '', description: '', budget: '', image: '' };

const STATUS_STYLES = {
  Active:    { bg: '#e6f7ed', color: '#1e8e4a' },
  Upcoming:  { bg: '#fff8e1', color: '#b28704' },
  Completed: { bg: '#f0f0f0', color: '#777' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Upcoming;
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

function spentOn(event) {
  return (event.expenses || []).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
}

function Events({ isAdmin }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchEvents = () => {
    setLoading(true);
    api.get('events/')
      .then(r => { setEvents(r.data); setError(''); })
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchEvents(); }, []);

  const openAdd = () => { setForm(EMPTY); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(EMPTY); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.time || !form.location || !form.budget) {
      alert('Please fill all required fields.'); return;
    }
    setSaving(true);
    try {
      await api.post('events/', { ...form, status: 'Upcoming', description: form.description || 'New NGO event.', budget: Number(form.budget) });
      fetchEvents();
      closeForm();
    } catch { alert('Error saving event.'); }
    finally { setSaving(false); }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#999' }}>Dashboard › Events</p>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>Events Management</h2>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, background: ORANGE, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p style={{ color: '#888' }}>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {events.length === 0 ? (
            <p style={{ color: '#888' }}>No events yet.</p>
          ) : events.map(event => {
            const spent = spentOn(event);
            const budget = Number(event.budget || 0);
            const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
            return (
              <div key={event.id} onClick={() => navigate(`/admin/events/${event.id}`)}
                style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
                <div style={{ height: 140, background: event.image ? `url(${event.image}) center/cover` : '#f0f0f0' }} />
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>{event.title}</h3>
                    <StatusBadge status={event.status} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, color: '#666', fontSize: 13, marginBottom: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={13} /> {event.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={13} /> {event.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {event.location}</span>
                  </div>
                  <div style={{ height: 6, background: '#eee', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#e53935' : ORANGE }} />
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: '#888' }}>₹{spent.toLocaleString()} of ₹{budget.toLocaleString()} spent</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Event Modal */}
      {showForm && (
        <div style={overlay}>
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>Add Event</h3>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {[
              { label: 'Title *', name: 'title', type: 'text' },
              { label: 'Date *', name: 'date', type: 'date' },
              { label: 'Time *', name: 'time', type: 'time' },
              { label: 'Location *', name: 'location', type: 'text' },
              { label: 'Budget (₹) *', name: 'budget', type: 'number' },
              { label: 'Image URL', name: 'image', type: 'text' },
              { label: 'Description', name: 'description', type: 'text' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name] || ''} onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={closeForm} style={{ padding: '9px 18px', borderRadius: 999, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSubmit} disabled={saving} style={{ padding: '9px 18px', borderRadius: 999, border: 'none', background: ORANGE, color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={15} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modal = { background: '#fff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' };

export default Events;