
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '0776 356325',
    location: 'Lira District',
    bio: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = (user?.username || 'U').substring(0, 2).toUpperCase();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .profile-page {
          min-height: 100vh;
          background: #f4f6f4;
          font-family: 'DM Sans', sans-serif;
        }

        .profile-hero {
          background: linear-gradient(135deg, #0f3620 0%, #1a5c34 60%, #0d4a24 100%);
          padding: 48px 0 90px;
          position: relative;
          overflow: hidden;
        }
        .profile-hero::after {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .profile-hero-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .profile-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .profile-avatar {
          width: 96px; height: 96px;
          border-radius: 50%;
          border: 4px solid rgba(74,222,128,0.5);
          object-fit: cover;
          background: linear-gradient(135deg, #4ade80, #16a34a);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          overflow: hidden;
        }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .profile-avatar-edit {
          position: absolute;
          bottom: 2px; right: 2px;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #4ade80;
          border: 2px solid #0f3620;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 13px;
          transition: transform 0.2s;
        }
        .profile-avatar-edit:hover { transform: scale(1.1); }
        .profile-hero-info { flex: 1; }
        .profile-hero-name {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .profile-hero-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .profile-role-badge {
          background: rgba(74,222,128,0.2);
          border: 1px solid rgba(74,222,128,0.35);
          color: #4ade80;
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .profile-hero-location {
          color: rgba(255,255,255,0.55);
          font-size: 13px;
        }
        .profile-hero-stats {
          display: flex;
          gap: 20px;
          margin-top: 18px;
        }
        .profile-stat {
          text-align: center;
          padding: 10px 18px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .profile-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #4ade80;
        }
        .profile-stat-label { font-size: 11px; color: rgba(255,255,255,0.5); }

        /* Main Content */
        .profile-main {
          max-width: 1000px;
          margin: -48px auto 60px;
          padding: 0 32px;
          position: relative;
          z-index: 10;
        }

        /* Tabs */
        .profile-tabs {
          display: flex;
          gap: 4px;
          background: #fff;
          border-radius: 14px 14px 0 0;
          padding: 8px 8px 0;
          border-bottom: 2px solid #e5e7eb;
        }
        .profile-tab {
          padding: 10px 22px;
          border-radius: 10px 10px 0 0;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .profile-tab:hover { color: #1f2937; background: #f9fafb; }
        .profile-tab.active {
          color: #166534;
          background: #f0fdf4;
          font-weight: 600;
          border-bottom: 2px solid #16a34a;
        }

        /* Tab Content */
        .profile-body {
          background: #fff;
          border-radius: 0 0 16px 16px;
          padding: 36px;
        }

        /* Sections */
        .profile-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f361c;
          margin-bottom: 4px;
        }
        .profile-section-sub {
          font-size: 13px;
          color: #9ca3af;
          margin-bottom: 28px;
        }
        .profile-section-divider {
          height: 1px;
          background: #f0fdf4;
          margin: 32px 0;
        }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-full { grid-column: 1 / -1; }
        .field-blk { display: flex; flex-direction: column; gap: 6px; }
        .field-lbl {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        .field-inp {
          padding: 11px 14px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: #fafafa;
          color: #1f2937;
          outline: none;
          transition: all 0.2s;
        }
        .field-inp:focus { border-color: #16a34a; background: #fff; }
        .field-inp.readonly { background: #f9fafb; color: #6b7280; cursor: not-allowed; }
        textarea.field-inp { resize: vertical; min-height: 90px; }

        .save-btn {
          padding: 12px 32px;
          background: linear-gradient(135deg, #166534, #15803d);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .save-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22,101,52,0.3);
        }
        .saved-toast {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 20px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          color: #16a34a;
          font-size: 14px;
          font-weight: 500;
          margin-left: 12px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

        /* Security Tab */
        .security-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          margin-bottom: 12px;
        }
        .security-item-left { display: flex; align-items: center; gap: 14px; }
        .security-item-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: #f0fdf4;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .security-item-title { font-size: 14px; font-weight: 600; color: #1f2937; }
        .security-item-desc { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .security-btn {
          padding: 8px 18px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          background: #fff;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .security-btn:hover { border-color: #16a34a; color: #16a34a; }

        /* Notif Tab */
        .notif-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .notif-item:last-child { border-bottom: none; }
        .notif-label { font-size: 14px; font-weight: 500; color: #1f2937; }
        .notif-desc { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .toggle {
          width: 44px; height: 24px;
          border-radius: 20px;
          background: #e5e7eb;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
          border: none;
          outline: none;
        }
        .toggle.on { background: #16a34a; }
        .toggle::after {
          content: '';
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .toggle.on::after { transform: translateX(20px); }

        @media (max-width: 700px) {
          .form-grid { grid-template-columns: 1fr; }
          .profile-hero-stats { flex-wrap: wrap; }
          .profile-main { padding: 0 16px; }
        }
      `}</style>

      <div className="profile-page">
        <Navbar />

        {/* Hero */}
        <div className="profile-hero">
          <div className="profile-hero-inner">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">
                {previewUrl
                  ? <img src={previewUrl} alt="Profile" />
                  : initials}
              </div>
              <div className="profile-avatar-edit" onClick={() => fileRef.current?.click()}>
                ✏️
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className="profile-hero-info">
              <h1 className="profile-hero-name">{user?.username || 'Your Name'}</h1>
              <div className="profile-hero-meta">
                <span className="profile-role-badge">{user?.role || 'member'}</span>
                <span className="profile-hero-location">📍 Lira District, Uganda</span>
              </div>
              <div className="profile-hero-stats">
                {[
                  { num: '—', label: 'Listings' },
                  { num: '—', label: 'Orders' },
                  { num: '—', label: 'Reviews' },
                ].map(s => (
                  <div key={s.label} className="profile-stat">
                    <div className="profile-stat-num">{s.num}</div>
                    <div className="profile-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="profile-main">
          <div className="profile-tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`profile-tab${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          <div className="profile-body">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <p className="profile-section-title">Personal Information</p>
                <p className="profile-section-sub">Update your personal details below</p>

                <div className="form-grid">
                  <div className="field-blk">
                    <label className="field-lbl">Username</label>
                    <input
                      className="field-inp readonly"
                      value={editData.username}
                      readOnly
                    />
                  </div>
                  <div className="field-blk">
                    <label className="field-lbl">Role</label>
                    <input
                      className="field-inp readonly"
                      value={(user?.role || 'member').toUpperCase()}
                      readOnly
                    />
                  </div>
                  <div className="field-blk">
                    <label className="field-lbl">Email Address</label>
                    <input
                      className="field-inp"
                      value={editData.email}
                      onChange={e => setEditData({ ...editData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="field-blk">
                    <label className="field-lbl">Phone Number</label>
                    <input
                      className="field-inp"
                      value={editData.phone}
                      onChange={e => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="+256 7XX XXX XXX"
                    />
                  </div>
                  <div className="field-blk">
                    <label className="field-lbl">Location / District</label>
                    <input
                      className="field-inp"
                      value={editData.location}
                      onChange={e => setEditData({ ...editData, location: e.target.value })}
                      placeholder="District name"
                    />
                  </div>
                  <div className="field-blk form-full">
                    <label className="field-lbl">Bio (optional)</label>
                    <textarea
                      className="field-inp"
                      value={editData.bio}
                      onChange={e => setEditData({ ...editData, bio: e.target.value })}
                      placeholder="Tell buyers or farmers a bit about yourself..."
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                  <button className="save-btn" onClick={handleSave}>Save Changes</button>
                  {saved && <span className="saved-toast">✓ Changes saved successfully</span>}
                </div>
              </>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <>
                <p className="profile-section-title">Security Settings</p>
                <p className="profile-section-sub">Manage your password and account security</p>

                {[
                  { icon: '🔑', title: 'Change Password', desc: 'Update your account password regularly', btn: 'Update' },
                  { icon: '📱', title: 'Two-Factor Authentication', desc: 'Add an extra layer of security with 2FA', btn: 'Enable' },
                  { icon: '🖥️', title: 'Active Sessions', desc: 'View and manage your logged-in devices', btn: 'View' },
                  { icon: '⚠️', title: 'Delete Account', desc: 'Permanently remove your account and data', btn: 'Delete' },
                ].map(item => (
                  <div key={item.title} className="security-item">
                    <div className="security-item-left">
                      <div className="security-item-icon">{item.icon}</div>
                      <div>
                        <div className="security-item-title">{item.title}</div>
                        <div className="security-item-desc">{item.desc}</div>
                      </div>
                    </div>
                    <button className="security-btn">{item.btn}</button>
                  </div>
                ))}
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <>
                <p className="profile-section-title">Notification Preferences</p>
                <p className="profile-section-sub">Choose what updates you want to receive</p>

                {[
                  { label: 'New Messages', desc: 'When a buyer or farmer contacts you', defaultOn: true },
                  { label: 'Price Alerts', desc: 'When produce prices change significantly', defaultOn: true },
                  { label: 'Order Updates', desc: 'Status changes on your orders', defaultOn: true },
                  { label: 'Weather Advisories', desc: 'Important weather warnings for your area', defaultOn: false },
                  { label: 'Platform News', desc: 'New features and platform announcements', defaultOn: false },
                ].map(item => {
                  const [on, setOn] = useState(item.defaultOn);
                  return (
                    <div key={item.label} className="notif-item">
                      <div>
                        <div className="notif-label">{item.label}</div>
                        <div className="notif-desc">{item.desc}</div>
                      </div>
                      <button
                        className={`toggle${on ? ' on' : ''}`}
                        onClick={() => setOn(!on)}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;