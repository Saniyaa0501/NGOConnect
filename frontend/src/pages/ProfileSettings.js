import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Mail, Phone, Shield, Lock, Pencil, X } from 'lucide-react';

const roleLabel = { admin: 'Administrator', user: 'Member' };

function ProfileSettings() {
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', phone: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileSaving, setProfileSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm_new_password: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const fetchProfile = () => {
    api.get('auth/profile/').then(r => {
      setProfileData(r.data);
      setForm({ username: r.data.username, email: r.data.email, phone: r.data.phone || '' });
    });
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwChange = e => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const initials = (profileData?.username || '?').slice(0, 2).toUpperCase();

  const saveProfile = () => {
    if (!form.username || !form.email) {
      setProfileMsg({ type: 'error', text: 'Username and email are required.' });
      return;
    }
    setProfileSaving(true);
    setProfileMsg({ type: '', text: '' });
    api.patch('auth/profile/', form)
      .then(r => {
        setProfileData(r.data);
        localStorage.setItem('user', JSON.stringify(r.data));
        setEditMode(false);
        setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
      })
      .catch(err => {
        const detail = err.response?.data;
        const msg = detail ? Object.values(detail).flat().join(' ') : 'Could not update profile. Try again.';
        setProfileMsg({ type: 'error', text: msg });
      })
      .finally(() => setProfileSaving(false));
  };

  const cancelEdit = () => {
    setForm({ username: profileData.username, email: profileData.email, phone: profileData.phone || '' });
    setEditMode(false);
    setProfileMsg({ type: '', text: '' });
  };

  const savePassword = () => {
    if (!pwForm.old_password || !pwForm.new_password || !pwForm.confirm_new_password) {
      setPwMsg({ type: 'error', text: 'Fill in all password fields.' });
      return;
    }
    setPwSaving(true);
    setPwMsg({ type: '', text: '' });
    api.post('auth/change-password/', pwForm)
      .then(() => {
        setPwMsg({ type: 'success', text: 'Password changed successfully.' });
        setPwForm({ old_password: '', new_password: '', confirm_new_password: '' });
      })
      .catch(err => {
        const detail = err.response?.data;
        const msg = detail ? Object.values(detail).flat().join(' ') : 'Could not change password. Try again.';
        setPwMsg({ type: 'error', text: msg });
      })
      .finally(() => setPwSaving(false));
  };

  if (!profileData) return null;

  return (
    <div>
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div>
          <h2>{profileData.username}</h2>
          <p className="profile-email">{profileData.email}</p>
          <span className="role-pill">
            <Shield size={12} strokeWidth={2.5} />
            {roleLabel[profileData.role] || profileData.role}
          </span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="card">
        <div className="section-header">
          <div className="section-header-left">
            <div className="section-icon"><User size={20} strokeWidth={2} /></div>
            <div>
              <h3 className="section-title">Profile Information</h3>
              <p className="section-subtitle">Your basic account details</p>
            </div>
          </div>
          {!editMode && (
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>
              <Pencil size={13} strokeWidth={2.5} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Edit Profile
            </button>
          )}
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '16px 0' }} />

        {profileMsg.text && (
          <div style={{
            background: profileMsg.type === 'success' ? '#e8f8f0' : '#fde8e8',
            color: profileMsg.type === 'success' ? '#27ae60' : '#e74c3c',
            padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 500
          }}>{profileMsg.text}</div>
        )}

        {editMode ? (
          <>
            <div className="form-grid">
              <div className="form-group"><label>Username *</label><input name="username" value={form.username} onChange={handleFormChange} placeholder="Enter username" /></div>
              <div className="form-group"><label>Email *</label><input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="Enter email" /></div>
              <div className="form-group"><label>Phone</label><input name="phone" value={form.phone} onChange={handleFormChange} placeholder="Enter phone number" /></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-success" onClick={saveProfile} disabled={profileSaving}>{profileSaving ? 'Saving...' : 'Save Changes'}</button>
              <button className="btn btn-danger" onClick={cancelEdit} disabled={profileSaving}>
                <X size={13} strokeWidth={2.5} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="info-row">
              <div className="info-icon"><User size={17} strokeWidth={2} /></div>
              <div>
                <div className="info-label">Username</div>
                <div className="info-value">{profileData.username}</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon"><Mail size={17} strokeWidth={2} /></div>
              <div>
                <div className="info-label">Email</div>
                <div className="info-value">{profileData.email}</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon"><Phone size={17} strokeWidth={2} /></div>
              <div>
                <div className="info-label">Phone</div>
                <div className="info-value">{profileData.phone || 'Not added yet'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-header-left" style={{ marginBottom: 6 }}>
          <div className="section-icon"><Lock size={20} strokeWidth={2} /></div>
          <div>
            <h3 className="section-title">Change Password</h3>
            <p className="section-subtitle">Update your account password</p>
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '16px 0' }} />

        {pwMsg.text && (
          <div style={{
            background: pwMsg.type === 'success' ? '#e8f8f0' : '#fde8e8',
            color: pwMsg.type === 'success' ? '#27ae60' : '#e74c3c',
            padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 500
          }}>{pwMsg.text}</div>
        )}

        <div className="form-grid">
          <div className="form-group"><label>Current Password *</label><input name="old_password" type="password" value={pwForm.old_password} onChange={handlePwChange} placeholder="Enter current password" /></div>
          <div className="form-group"><label>New Password *</label><input name="new_password" type="password" value={pwForm.new_password} onChange={handlePwChange} placeholder="Enter new password" /></div>
          <div className="form-group"><label>Confirm New Password *</label><input name="confirm_new_password" type="password" value={pwForm.confirm_new_password} onChange={handlePwChange} placeholder="Re-enter new password" /></div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={savePassword} disabled={pwSaving}>{pwSaving ? 'Updating...' : 'Update Password'}</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;