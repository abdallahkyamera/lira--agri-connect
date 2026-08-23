
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleMode, setRoleMode] = useState('farmer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'farmer', label: 'Farmer', icon: '🌱', desc: 'List & manage your produce' },
    { id: 'buyer', label: 'Buyer', icon: '🛒', desc: 'Browse & purchase produce' },
    { id: 'admin', label: 'Admin', icon: '⚙️', desc: 'Manage platform operations' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a1f0f;
        }

        /* Left Panel */
        .login-left {
          flex: 1;
          background: linear-gradient(160deg, #0f3620 0%, #1a5c34 40%, #0d4a24 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 70px;
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 60px;
        }
        .login-logo-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .login-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
        }
        .login-logo-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .login-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 20px;
        }
        .login-hero-title em {
          color: #4ade80;
          font-style: italic;
        }
        .login-hero-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 380px;
          margin-bottom: 50px;
        }
        .login-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .login-stat {
          padding: 20px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          backdrop-filter: blur(10px);
        }
        .login-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #4ade80;
          line-height: 1;
          margin-bottom: 4px;
        }
        .login-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          font-weight: 400;
        }

        /* Right Panel */
        .login-right {
          width: 520px;
          flex-shrink: 0;
          background: #f8faf8;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 52px;
          overflow-y: auto;
        }
        .login-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #0f361c;
          margin-bottom: 6px;
        }
        .login-form-sub {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 32px;
        }

        /* Role Selector */
        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 30px;
        }
        .role-card {
          padding: 14px 10px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          background: #fff;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }
        .role-card:hover {
          border-color: #86efac;
          background: #f0fdf4;
        }
        .role-card.selected {
          border-color: #16a34a;
          background: #f0fdf4;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }
        .role-icon { font-size: 22px; margin-bottom: 5px; }
        .role-label {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          display: block;
          margin-bottom: 2px;
        }
        .role-desc {
          font-size: 10px;
          color: #9ca3af;
          line-height: 1.3;
        }
        .role-card.selected .role-label { color: #15803d; }

        /* Form Fields */
        .field-group { margin-bottom: 18px; }
        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 7px;
        }
        .field-input-wrap { position: relative; }
        .field-input {
          width: 100%;
          padding: 13px 16px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          color: #1f2937;
          transition: border-color 0.2s;
          outline: none;
        }
        .field-input:focus { border-color: #16a34a; }
        .field-input.has-icon { padding-right: 48px; }
        .field-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #9ca3af;
          font-size: 18px;
          user-select: none;
          border: none;
          background: none;
          padding: 0;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
          font-size: 13px;
          margin-bottom: 18px;
        }

        .login-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #166534, #15803d);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.2px;
          position: relative;
          overflow: hidden;
        }
        .login-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #15803d, #166534);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(22, 101, 52, 0.35);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-btn-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-register-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #6b7280;
        }
        .login-register-link span {
          color: #16a34a;
          cursor: pointer;
          font-weight: 600;
        }
        .login-register-link span:hover { text-decoration: underline; }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .login-divider-line { flex: 1; height: 1px; background: #e5e7eb; }
        .login-divider-text { font-size: 12px; color: #9ca3af; white-space: nowrap; }

        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 40px 28px; }
        }
      `}</style>

      <div className="login-page">
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-logo">
            <div className="login-logo-icon">🌾</div>
            <div>
              <div className="login-logo-name">Lira Agri-Connect</div>
              <div className="login-logo-sub">Lira District · Uganda</div>
            </div>
          </div>

          <h1 className="login-hero-title">
            Connecting<br />
            Farmers with<br />
            <em>Better Markets</em>
          </h1>
          <p className="login-hero-sub">
            A direct marketplace bridging local farmers and buyers in Lira District — fair prices, fresh produce, real impact.
          </p>

          <div className="login-stats">
            {[
              {  label: 'Trusted Active Farmers' },
              {  label: 'interactions ' },
              { label: 'covering lira district' },
            ].map(s => (
              <div key={s.label} className="login-stat">
                <div className="login-stat-num">{s.num}</div>
                <div className="login-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-sub">Sign in to continue to your dashboard</p>

          {/* Role Selector */}
          <div className="role-grid">
            {roles.map(r => (
              <div
                key={r.id}
                className={`role-card${roleMode === r.id ? ' selected' : ''}`}
                onClick={() => setRoleMode(r.id)}
              >
                <div className="role-icon">{r.icon}</div>
                <span className="role-label">{r.label}</span>
                <span className="role-desc">{r.desc}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Username</label>
              <input
                type="text"
                className="field-input"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-input-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="field-input has-icon"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="field-eye"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <><span className="login-btn-spinner" />Signing in...</>
              ) : (
                `Sign in as ${roleMode.charAt(0).toUpperCase() + roleMode.slice(1)}`
              )}
            </button>
          </form>

          <p className="login-register-link">
            Don't have an account?{' '}
            <span onClick={() => navigate('/register')}>Create account</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;