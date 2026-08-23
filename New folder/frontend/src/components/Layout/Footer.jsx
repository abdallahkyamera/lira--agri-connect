
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Profile', path: '/profile' },
    { label: 'Order History', path: '/orders' },
  ];

  const marketLinks = [
    { label: 'Price Predictions', path: '/dashboard' },
    { label: 'Live Marketplace', path: '/dashboard' },
    { label: 'Weather Advisory', path: '/dashboard' },
    { label: 'Market Insights', path: '/dashboard' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .footer-root {
          background: linear-gradient(160deg, #0a1f0f 0%, #0f3620 50%, #0a1f0f 100%);
          color: #fff;
          margin-top: 80px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .footer-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(74,222,128,0.5), transparent);
        }
        .footer-glow {
          position: absolute;
          top: -100px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 65%);
          pointer-events: none;
        }

        .footer-top {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 40px 48px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 48px;
          position: relative;
          z-index: 1;
        }

        /* Brand Column */
        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .footer-brand-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .footer-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .footer-brand-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-top: 3px;
        }
        .footer-tagline {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          line-height: 1.75;
          max-width: 280px;
          margin-bottom: 28px;
        }
        .footer-social {
          display: flex;
          gap: 10px;
        }
        .footer-social-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .footer-social-btn:hover {
          background: rgba(74,222,128,0.15);
          border-color: rgba(74,222,128,0.3);
          transform: translateY(-2px);
        }

        /* Nav Columns */
        .footer-col-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #4ade80;
          margin-bottom: 20px;
        }
        .footer-links { list-style: none; padding: 0; margin: 0; }
        .footer-link-item { margin-bottom: 12px; }
        .footer-link {
          color: rgba(255,255,255,0.55);
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
          display: inline-block;
          background: none;
          border: none;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .footer-link:hover { color: #fff; }

        /* Contact Column */
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 14px;
        }
        .footer-contact-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .footer-contact-val {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          padding-top: 6px;
          line-height: 1.4;
        }

        /* Newsletter */
        .footer-newsletter {
          margin-top: 20px;
        }
        .footer-newsletter-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #4ade80;
          margin-bottom: 10px;
        }
        .footer-newsletter-form {
          display: flex;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .footer-newsletter-input {
          flex: 1;
          padding: 10px 14px;
          background: rgba(255,255,255,0.06);
          border: none;
          color: #fff;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
        }
        .footer-newsletter-input::placeholder { color: rgba(255,255,255,0.35); }
        .footer-newsletter-btn {
          padding: 10px 16px;
          background: #16a34a;
          color: #fff;
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .footer-newsletter-btn:hover { background: #15803d; }

        /* Bottom Bar */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 20px 40px;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .footer-bottom-copy {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }
        .footer-bottom-copy strong { color: rgba(255,255,255,0.6); font-weight: 500; }
        .footer-bottom-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }
        .footer-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }
        .footer-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 900px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
        }
        @media (max-width: 580px) {
          .footer-top {
            grid-template-columns: 1fr;
            padding: 48px 24px 32px;
          }
          .footer-bottom {
            padding: 20px 24px;
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-glow" />

        <div className="footer-top">
          {/* Brand */}
          <div>
            <div className="footer-brand-logo">
              <div className="footer-brand-icon">🌾</div>
              <div>
                <div className="footer-brand-name">Lira Agri-Connect</div>
                <div className="footer-brand-sub">Lira District · Uganda</div>
              </div>
            </div>
            <p className="footer-tagline">
              Bridging farmers and buyers with technology for a thriving, transparent agricultural ecosystem in Lira District.
            </p>
            <div className="footer-social">
              {['📘', '🐦', '📷', '💼'].map((icon, i) => (
                <a key={i} className="footer-social-btn" href="#">{icon}</a>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-links">
              {navLinks.map(link => (
                <li key={link.path} className="footer-link-item">
                  <button className="footer-link" onClick={() => navigate(link.path)}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Market Tools */}
          <div>
            <div className="footer-col-title">Market Tools</div>
            <ul className="footer-links">
              {marketLinks.map(link => (
                <li key={link.label} className="footer-link-item">
                  <button className="footer-link" onClick={() => navigate(link.path)}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <div className="footer-col-title">Get In Touch</div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon">📍</div>
              <div className="footer-contact-val">Lira District, Northern Uganda</div>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon">📞</div>
              <div className="footer-contact-val">+256 776 356 325</div>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon">✉️</div>
              <div className="footer-contact-val">xanderpogba05@gmail.com</div>
            </div>

            <div className="footer-newsletter">
              <div className="footer-newsletter-title">Market Updates</div>
              <div className="footer-newsletter-form">
                <input
                  className="footer-newsletter-input"
                  placeholder="Your email address"
                  type="email"
                />
                <button className="footer-newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-copy">
            © 2026 Lira Agri-Connect · Final Year Project ·{' '}
            <strong>Kyamera, Rodney & Daniel</strong>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-status">
              <div className="footer-status-dot" />
              All systems operational
            </div>
            <div className="footer-dot" />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
              Empowering Sustainable Agriculture
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;