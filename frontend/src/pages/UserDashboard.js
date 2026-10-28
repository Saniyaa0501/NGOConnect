import React from 'react';
import {
  User,
  Globe2,
  Handshake,
  HeartHandshake,
  Users,
  UserPlus,
  Zap,
  Wallet,
  Heart,
  HandHelping,
} from 'lucide-react';

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #FF6B00)', borderRadius: 14, padding: '28px 32px', marginBottom: 24, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Welcome back</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}> {user.username}</h2>
          <p style={{ fontSize: 14, opacity: 0.75, marginTop: 6 }}>You're part of the NGOConnect community. Together we make a difference.</p>
        </div>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HeartHandshake size={32} color="white" strokeWidth={1.75} />
        </div>
      </div>

      {/* Profile + Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
        {/* Profile Card */}
        <div className="card" style={{ borderTop: '4px solid #FF6B00', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, background: '#fff3e0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="#FF6B00" strokeWidth={2} />
            </div>
            <h3 style={{ margin: 0, fontSize: 15 }}>My Profile</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
              <span style={{ color: '#888' }}>Username</span><span style={{ fontWeight: 600 }}>{user.username}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
              <span style={{ color: '#888' }}>Email</span><span style={{ fontWeight: 600 }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#888' }}>Role</span>
              <span style={{ fontWeight: 600, background: '#fff3e0', color: '#FF6B00', padding: '2px 10px', borderRadius: 12, fontSize: 12 }}>User</span>
            </div>
          </div>
        </div>

        {/* About NGO Card */}
        <div className="card" style={{ borderTop: '4px solid #2ecc71', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, background: '#e8f8f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe2 size={18} color="#2ecc71" strokeWidth={2} />
            </div>
            <h3 style={{ margin: 0, fontSize: 15 }}>About NGOConnect</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
              <span style={{ color: '#888' }}>Mission</span><span style={{ fontWeight: 600 }}>Community Support</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
              <span style={{ color: '#888' }}>Location</span><span style={{ fontWeight: 600 }}>Mumbai, India</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#888' }}>Status</span>
              <span style={{ fontWeight: 600, background: '#e8f8f0', color: '#2ecc71', padding: '2px 10px', borderRadius: 12, fontSize: 12 }}>Active</span>
            </div>
          </div>
        </div>

        {/* How to Help Card */}
        <div className="card" style={{ borderTop: '4px solid #3498db', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, background: '#eaf4fd', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Handshake size={18} color="#3498db" strokeWidth={2} />
            </div>
            <h3 style={{ margin: 0, fontSize: 15 }}>How You Can Help</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
              <Wallet size={15} color="#999" strokeWidth={2} />
              <span style={{ color: '#444' }}>Make a donation from sidebar</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
              <Users size={15} color="#999" strokeWidth={2} />
              <span style={{ color: '#444' }}>View lives we've impacted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <UserPlus size={15} color="#999" strokeWidth={2} />
              <span style={{ color: '#444' }}>Register as a volunteer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 38, height: 38, background: '#fff3e0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#FF6B00" strokeWidth={2} />
          </div>
          <h3 style={{ margin: 0, fontSize: 15 }}>Quick Actions</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <a href="/user/donate" style={{ background: 'linear-gradient(135deg, #FF6B00, #ff8c38)', borderRadius: 12, padding: '20px', textAlign: 'center', textDecoration: 'none', color: 'white', display: 'block' }}>
            <Wallet size={26} color="white" strokeWidth={1.75} style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 14 }}>Make a Donation</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Support our cause</div>
          </a>
          <a href="/user/beneficiaries" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)', borderRadius: 12, padding: '20px', textAlign: 'center', textDecoration: 'none', color: 'white', display: 'block' }}>
            <Heart size={26} color="white" strokeWidth={1.75} style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 14 }}>Lives Impacted</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>See who we help</div>
          </a>
          <a href="/user/volunteer" style={{ background: 'linear-gradient(135deg, #3498db, #2980b9)', borderRadius: 12, padding: '20px', textAlign: 'center', textDecoration: 'none', color: 'white', display: 'block' }}>
            <HandHelping size={26} color="white" strokeWidth={1.75} style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 14 }}>Join as Volunteer</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Give your time</div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;