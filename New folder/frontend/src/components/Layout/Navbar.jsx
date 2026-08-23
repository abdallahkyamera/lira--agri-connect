
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Orders', path: '/orders' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .nav-root {
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-root.scrolled {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(15, 54, 28, 0.95) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }
        .nav-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 32px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #4ade80, #86efac);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .nav-brand-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
          line-height: 1;
        }
        .nav-brand-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          padding: 8px 16px;
          border-radius: 8px;
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.1px;
        }
        .nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.1);
        }
        .nav-link.active {
          color: #4ade80;
          background: rgba(74, 222, 128, 0.12);
        }
        .nav-divider {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.15);
          margin: 0 8px;
        }
        .nav-user-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 40px;
          padding: 6px 16px 6px 8px;
        }
        .nav-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4ade80, #16a34a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .nav-username {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
        }
        .nav-role-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #4ade80;
          background: rgba(74, 222, 128, 0.15);
          padding: 2px 7px;
          border-radius: 20px;
        }
        .nav-logout {
          padding: 8px 18px;
          border-radius: 8px;
          background: rgba(220, 38, 38, 0.15);
          color: #fca5a5;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid rgba(220, 38, 38, 0.25);
          font-family: 'DM Sans', sans-serif;
        }
        .nav-logout:hover {
          background: rgba(220, 38, 38, 0.28);
          color: #fff;
        }
        .nav-bar-bottom {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74, 222, 128, 0.3), transparent);
        }
      `}</style>

      <nav
        className={`nav-root${scrolled ? ' scrolled' : ''}`}
        style={{ background: '#0f361c' }}
      >
        <div className="nav-inner">
          {/* Brand */}
          <div className="nav-brand" onClick={() => navigate('/dashboard')}>
            <div className="nav-brand-icon">🌾</div>
            <div>
              <div className="nav-brand-text">Lira Agri-Connect</div>
              <div className="nav-brand-sub">Lira District · Uganda</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="nav-links">
            {navLinks.map(link => (
              <button
                key={link.path}
                className={`nav-link${isActive(link.path) ? ' active' : ''}`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))}

            <div className="nav-divider" />

            {/* User Pill */}
            <div className="nav-user-pill">
              <div className="nav-avatar">
                {user?.username?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="nav-username">{user?.username}</div>
              </div>
              <span className="nav-role-badge">{user?.role || 'user'}</span>
            </div>

            <button className="nav-logout" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
        <div className="nav-bar-bottom" />
      </nav>
    </>
  );
};

export default Navbar;