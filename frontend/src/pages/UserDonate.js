import React, { useState, useEffect } from 'react';
import { Gift, Wallet, CheckCircle2, Receipt } from 'lucide-react';
import api from '../api/axios';

const empty = { donor_name: '', amount: '', date: '', payment_mode: 'Cash', notes: '' };

const statusLabel = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
};

function UserDonate() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [form, setForm] = useState({ ...empty, donor_name: user.username || '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [myDonations, setMyDonations] = useState([]);

  const fetchMyDonations = () => {
    api.get('donations/').then(r => {
      const mine = r.data.filter(d => d.donor_name === (user.username || form.donor_name));
      setMyDonations(mine.sort((a, b) => b.id - a.id));
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchMyDonations();
}, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.donor_name || !form.amount || !form.date) return setError('Fill required fields!');
    setError('');
    api.post('donations/', { ...form, status: 'Received' })
      .then(() => { setSubmitted(true); fetchMyDonations(); })
      .catch(() => setError('Something went wrong. Try again.'));
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #FF6B00)', borderRadius: 14, padding: '24px 32px', marginBottom: 24, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Make a Donation</h2>
          <p style={{ fontSize: 14, opacity: 0.8, marginTop: 6, margin: '6px 0 0' }}>Your contribution directly helps those in need.</p>
        </div>
        <Gift size={44} color="white" style={{ opacity: 0.85 }} />
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 38, height: 38, background: '#fff3e0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={18} color="#FF6B00" />
          </div>
          <h3 style={{ margin: 0, color: '#FF6B00' }}>Donation Details</h3>
        </div>

        {submitted ? (
          <div style={{ background: '#e8f8f0', border: '1px solid #2ecc71', color: '#27ae60', padding: '24px', borderRadius: 10, textAlign: 'center' }}>
            <CheckCircle2 size={44} style={{ marginBottom: 10 }} />
            <h3 style={{ margin: '0 0 6px' }}>Thank You for Your Donation!</h3>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>Your generous contribution has been recorded. Together we make a difference!</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => { setSubmitted(false); setForm({ ...empty, donor_name: user.username || '' }); }}>Make Another Donation</button>
          </div>
        ) : (
          <>
            {error && <div style={{ background: '#fde8e8', color: '#e74c3c', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
            <div className="form-grid">
              <div className="form-group"><label>Your Name *</label><input name="donor_name" value={form.donor_name} onChange={handleChange} placeholder="Enter your name" /></div>
              <div className="form-group"><label>Amount (₹) *</label><input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Enter amount" /></div>
              <div className="form-group"><label>Date *</label><input name="date" type="date" value={form.date} onChange={handleChange} /></div>
              <div className="form-group">
                <label>Payment Mode</label>
                <select name="payment_mode" value={form.payment_mode} onChange={handleChange}>
                  <option>Cash</option><option>Online</option><option>Cheque</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Message (Optional)</label><input name="notes" value={form.notes} onChange={handleChange} placeholder="Leave a message with your donation" /></div>
            </div>
            <div className="form-actions" style={{ marginTop: 24 }}>
              <button className="btn btn-success" onClick={handleSubmit} style={{ padding: '10px 28px', fontSize: 15 }}>Donate Now</button>
            </div>
          </>
        )}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 38, height: 38, background: '#fff3e0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={18} color="#FF6B00" />
          </div>
          <h3 style={{ margin: 0, color: '#FF6B00' }}>My Donations</h3>
        </div>

        <table>
          <thead>
            <tr><th>#</th><th>Amount</th><th>Date</th><th>Payment Mode</th><th>Approval</th></tr>
          </thead>
          <tbody>
            {myDonations.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>No donations yet</td></tr>
            ) : myDonations.map((d, i) => (
              <tr key={d.id}>
                <td>{i + 1}</td>
                <td>₹{parseFloat(d.amount).toLocaleString()}</td>
                <td>{d.date}</td>
                <td>{d.payment_mode}</td>
                <td><span className={`badge badge-${d.approval_status}`}>{statusLabel[d.approval_status] || d.approval_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDonate;