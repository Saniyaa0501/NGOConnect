import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import api from '../../api/axios';

const STATUS_STYLES = {
  Active: { bg: '#e6f7ed', color: '#1e8e4a' },
  Upcoming: { bg: '#fff8e1', color: '#b28704' },
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

function UserEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('events/')
      .then(r => { setEvents(r.data); setError(''); })
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className="page-title" style={{ margin: 0 }}>Events</h2>
        <p style={{ color: '#888', margin: '4px 0 0', fontSize: 14 }}>See what our NGO has planned and completed</p>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p>Loading...</p> : (

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {events.length === 0 ? (
            <p style={{ color: '#888' }}>No events to show yet.</p>
          ) : events.map(event => (
            <div key={event.id}
              style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
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
                <p style={{ margin: 0, fontSize: 13, color: '#444' }}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserEvents;