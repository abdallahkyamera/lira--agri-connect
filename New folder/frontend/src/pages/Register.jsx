

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    location: '',
    role: 'farmer',
    national_id: '',
    trade_license: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        location: formData.location,
        national_id: formData.national_id,
        trade_license: formData.trade_license
      };

      console.log('Sending:', payload);

      await registerUser(payload);

      alert('Registration successful!');

      navigate('/login');
    } catch (err) {
      console.error(err.response?.data);

      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #166534 0%, #4ade80 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '550px',
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            color: '#166534'
          }}
        >
          Lira Agri-Connect
        </h1>

        <h2
          style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="location"
            placeholder="Location (District)"
            value={formData.location}
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>

          {formData.role === 'farmer' && (
            <>
              <input
                type="text"
                name="national_id"
                placeholder="National ID"
                value={formData.national_id}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                type="text"
                name="trade_license"
                placeholder="Trade License"
                value={formData.trade_license}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {error && (
            <p
              style={{
                color: 'red',
                textAlign: 'center',
                marginBottom: '15px'
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              border: 'none',
              borderRadius: '10px',
              background: '#166534',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px'
          }}
        >
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#166534',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '15px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  fontSize: '15px',
  boxSizing: 'border-box'
};

export default Register;




// // src/pages/Register.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { registerUser } from '../services/api';

// const Register = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     phone: '',
//     location: '',
//     role: 'farmer',
//     national_id: '',
//     trade_license: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleNext = (e) => {
//     e.preventDefault();
//     if (!formData.username || !formData.email || !formData.phone) {
//       setError('Please fill all required fields');
//       return;
//     }
//     setError('');
//     setStep(2);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const payload = {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//         phone: formData.phone,
//         location: formData.location,
//         national_id: formData.national_id,
//         trade_license: formData.trade_license
//       };
//       await registerUser(payload);
//       navigate('/login');
//     } catch (err) {
//       if (err.response?.data) {
//         const msgs = Object.values(err.response.data).flat().join(' ');
//         setError(msgs || 'Registration failed');
//       } else {
//         setError('Registration failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .reg-page {
//           min-height: 100vh;
//           display: flex;
//           font-family: 'DM Sans', sans-serif;
//           background: #f8faf8;
//         }

//         /* Sidebar */
//         .reg-sidebar {
//           width: 380px;
//           flex-shrink: 0;
//           background: linear-gradient(160deg, #0f3620 0%, #1a5c34 50%, #0d4a24 100%);
//           display: flex;
//           flex-direction: column;
//           padding: 50px 44px;
//           position: relative;
//           overflow: hidden;
//         }
//         .reg-sidebar::after {
//           content: '';
//           position: absolute;
//           bottom: -100px; right: -100px;
//           width: 400px; height: 400px;
//           background: radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%);
//           pointer-events: none;
//         }
//         .reg-logo {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 60px;
//         }
//         .reg-logo-icon {
//           width: 42px; height: 42px;
//           background: linear-gradient(135deg, #4ade80, #22c55e);
//           border-radius: 12px;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 20px;
//         }
//         .reg-logo-name {
//           font-family: 'Playfair Display', serif;
//           font-size: 18px;
//           font-weight: 700;
//           color: #fff;
//         }
//         .reg-sidebar-title {
//           font-family: 'Playfair Display', serif;
//           font-size: 34px;
//           font-weight: 700;
//           color: #fff;
//           line-height: 1.2;
//           margin-bottom: 16px;
//         }
//         .reg-sidebar-title em { color: #4ade80; font-style: italic; }
//         .reg-sidebar-sub {
//           font-size: 14px;
//           color: rgba(255,255,255,0.6);
//           line-height: 1.7;
//           margin-bottom: 48px;
//         }
//         .reg-steps-list { list-style: none; }
//         .reg-step-item {
//           display: flex;
//           align-items: flex-start;
//           gap: 14px;
//           margin-bottom: 24px;
//         }
//         .reg-step-dot {
//           width: 28px; height: 28px;
//           border-radius: 50%;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 12px;
//           font-weight: 700;
//           flex-shrink: 0;
//           transition: all 0.3s;
//         }
//         .reg-step-dot.done {
//           background: #4ade80;
//           color: #0f361c;
//         }
//         .reg-step-dot.active {
//           background: rgba(74, 222, 128, 0.2);
//           border: 2px solid #4ade80;
//           color: #4ade80;
//         }
//         .reg-step-dot.pending {
//           background: rgba(255,255,255,0.1);
//           border: 2px solid rgba(255,255,255,0.2);
//           color: rgba(255,255,255,0.4);
//         }
//         .reg-step-label {
//           font-size: 14px;
//           font-weight: 500;
//           color: #fff;
//           padding-top: 4px;
//         }
//         .reg-step-label.pending { color: rgba(255,255,255,0.4); }
//         .reg-step-desc {
//           font-size: 12px;
//           color: rgba(255,255,255,0.45);
//           margin-top: 2px;
//         }

//         /* Form Panel */
//         .reg-form-panel {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           padding: 60px 70px;
//           overflow-y: auto;
//         }

//         .reg-form-header {
//           margin-bottom: 36px;
//         }
//         .reg-step-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           background: #f0fdf4;
//           border: 1px solid #bbf7d0;
//           border-radius: 20px;
//           padding: 4px 12px;
//           font-size: 12px;
//           font-weight: 600;
//           color: #16a34a;
//           letter-spacing: 0.5px;
//           margin-bottom: 14px;
//         }
//         .reg-form-title {
//           font-family: 'Playfair Display', serif;
//           font-size: 30px;
//           font-weight: 700;
//           color: #0f361c;
//           margin-bottom: 6px;
//         }
//         .reg-form-sub {
//           font-size: 14px;
//           color: #6b7280;
//         }

//         /* Role Cards */
//         .role-cards {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//           margin-bottom: 26px;
//         }
//         .role-card-reg {
//           padding: 16px 18px;
//           border-radius: 12px;
//           border: 2px solid #e5e7eb;
//           background: #fff;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           transition: all 0.2s;
//         }
//         .role-card-reg:hover { border-color: #86efac; background: #f0fdf4; }
//         .role-card-reg.selected {
//           border-color: #16a34a;
//           background: #f0fdf4;
//           box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
//         }
//         .role-card-icon-reg { font-size: 24px; }
//         .role-card-label {
//           font-size: 14px;
//           font-weight: 600;
//           color: #1f2937;
//         }
//         .role-card-desc { font-size: 11px; color: #9ca3af; }
//         .role-card-reg.selected .role-card-label { color: #15803d; }

//         /* Fields */
//         .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//         .field-g { margin-bottom: 20px; }
//         .field-lbl {
//           display: block;
//           font-size: 13px;
//           font-weight: 500;
//           color: #374151;
//           margin-bottom: 7px;
//         }
//         .field-lbl .req { color: #dc2626; margin-left: 2px; }
//         .field-wrap { position: relative; }
//         .field-inp {
//           width: 100%;
//           padding: 12px 16px;
//           font-size: 15px;
//           font-family: 'DM Sans', sans-serif;
//           border: 2px solid #e5e7eb;
//           border-radius: 10px;
//           background: #fff;
//           color: #1f2937;
//           outline: none;
//           transition: border-color 0.2s;
//         }
//         .field-inp:focus { border-color: #16a34a; }
//         .field-inp.has-eye { padding-right: 46px; }
//         .field-eye-btn {
//           position: absolute;
//           right: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           background: none;
//           border: none;
//           cursor: pointer;
//           font-size: 16px;
//           color: #9ca3af;
//           padding: 0;
//         }

//         .section-divider {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin: 8px 0 22px;
//         }
//         .section-divider-line { flex: 1; height: 1px; background: #e5e7eb; }
//         .section-divider-label {
//           font-size: 11px;
//           font-weight: 600;
//           color: #9ca3af;
//           letter-spacing: 1px;
//           text-transform: uppercase;
//         }

//         .info-box {
//           display: flex;
//           align-items: flex-start;
//           gap: 10px;
//           padding: 14px 16px;
//           background: #fef9c3;
//           border: 1px solid #fde68a;
//           border-radius: 10px;
//           font-size: 13px;
//           color: #854d0e;
//           margin-bottom: 24px;
//           line-height: 1.5;
//         }

//         .err-box {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 12px 16px;
//           background: #fef2f2;
//           border: 1px solid #fecaca;
//           border-radius: 10px;
//           color: #dc2626;
//           font-size: 13px;
//           margin-bottom: 20px;
//         }

//         .reg-actions {
//           display: flex;
//           gap: 12px;
//           margin-top: 4px;
//         }
//         .btn-back {
//           padding: 13px 28px;
//           border: 2px solid #e5e7eb;
//           border-radius: 10px;
//           background: #fff;
//           color: #374151;
//           font-size: 14px;
//           font-weight: 600;
//           font-family: 'DM Sans', sans-serif;
//           cursor: pointer;
//           transition: all 0.2s;
//         }
//         .btn-back:hover { border-color: #9ca3af; }
//         .btn-next, .btn-submit {
//           flex: 1;
//           padding: 13px;
//           background: linear-gradient(135deg, #166534, #15803d);
//           color: #fff;
//           font-size: 15px;
//           font-weight: 600;
//           font-family: 'DM Sans', sans-serif;
//           border: none;
//           border-radius: 10px;
//           cursor: pointer;
//           transition: all 0.2s;
//         }
//         .btn-next:hover, .btn-submit:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 8px 24px rgba(22,101,52,0.3);
//         }
//         .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
//         .spinner {
//           display: inline-block;
//           width: 14px; height: 14px;
//           border: 2px solid rgba(255,255,255,0.3);
//           border-top-color: #fff;
//           border-radius: 50%;
//           animation: spin 0.7s linear infinite;
//           vertical-align: middle;
//           margin-right: 8px;
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .login-link {
//           text-align: center;
//           margin-top: 24px;
//           font-size: 14px;
//           color: #6b7280;
//         }
//         .login-link span {
//           color: #16a34a;
//           cursor: pointer;
//           font-weight: 600;
//         }

//         @media (max-width: 860px) {
//           .reg-sidebar { display: none; }
//           .reg-form-panel { padding: 40px 28px; }
//           .field-row { grid-template-columns: 1fr; }
//         }
//       `}</style>

//       <div className="reg-page">
//         {/* Sidebar */}
//         <div className="reg-sidebar">
//           <div className="reg-logo">
//             <div className="reg-logo-icon">🌾</div>
//             <div className="reg-logo-name">Lira Agri-Connect</div>
//           </div>

//           <h2 className="reg-sidebar-title">
//             Join the<br />
//             <em>Agricultural</em><br />
//             Network
//           </h2>
//           <p className="reg-sidebar-sub">
//             Create your account to start buying or selling fresh produce directly in Lira District.
//           </p>

//           <ul className="reg-steps-list">
//             {[
//               { n: 1, label: 'Personal Info', desc: 'Your basic details' },
//               { n: 2, label: 'Verification & Password', desc: 'Secure your account' },
//             ].map(s => (
//               <li key={s.n} className="reg-step-item">
//                 <div className={`reg-step-dot ${step > s.n ? 'done' : step === s.n ? 'active' : 'pending'}`}>
//                   {step > s.n ? '✓' : s.n}
//                 </div>
//                 <div>
//                   <div className={`reg-step-label ${step < s.n ? 'pending' : ''}`}>{s.label}</div>
//                   <div className="reg-step-desc">{s.desc}</div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Form Panel */}
//         <div className="reg-form-panel">
//           <div className="reg-form-header">
//             <span className="reg-step-badge">Step {step} of 2</span>
//             <h2 className="reg-form-title">
//               {step === 1 ? 'Your Information' : 'Verification & Password'}
//             </h2>
//             <p className="reg-form-sub">
//               {step === 1
//                 ? 'Tell us a bit about yourself to get started'
//                 : 'Add verification details and secure your account'}
//             </p>
//           </div>

//           {/* Step 1 */}
//           {step === 1 && (
//             <form onSubmit={handleNext}>
//               {/* Role selector */}
//               <div className="role-cards">
//                 {[
//                   { id: 'farmer', icon: '🌱', label: 'Farmer', desc: 'Sell your produce' },
//                   { id: 'buyer', icon: '🛒', label: 'Buyer', desc: 'Purchase produce' },
//                 ].map(r => (
//                   <div
//                     key={r.id}
//                     className={`role-card-reg${formData.role === r.id ? ' selected' : ''}`}
//                     onClick={() => setFormData({ ...formData, role: r.id })}
//                   >
//                     <span className="role-card-icon-reg">{r.icon}</span>
//                     <div>
//                       <div className="role-card-label">{r.label}</div>
//                       <div className="role-card-desc">{r.desc}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="field-row">
//                 <div className="field-g">
//                   <label className="field-lbl">Username <span className="req">*</span></label>
//                   <input name="username" className="field-inp" placeholder="e.g. john_farmer" value={formData.username} onChange={handleChange} required />
//                 </div>
//                 <div className="field-g">
//                   <label className="field-lbl">Email Address <span className="req">*</span></label>
//                   <input type="email" name="email" className="field-inp" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
//                 </div>
//               </div>

//               <div className="field-row">
//                 <div className="field-g">
//                   <label className="field-lbl">Phone Number <span className="req">*</span></label>
//                   <input type="tel" name="phone" className="field-inp" placeholder="+256 7XX XXX XXX" value={formData.phone} onChange={handleChange} required />
//                 </div>
//                 <div className="field-g">
//                   <label className="field-lbl">Location (District)</label>
//                   <input name="location" className="field-inp" placeholder="e.g. Lira District" value={formData.location} onChange={handleChange} />
//                 </div>
//               </div>

//               {error && <div className="err-box">⚠️ {error}</div>}

//               <button type="submit" className="btn-next">
//                 Continue to Step 2 →
//               </button>
//             </form>
//           )}

//           {/* Step 2 */}
//           {step === 2 && (
//             <form onSubmit={handleSubmit}>
//               {formData.role === 'farmer' && (
//                 <>
//                   <div className="section-divider">
//                     <div className="section-divider-line" />
//                     <span className="section-divider-label">Farmer Verification</span>
//                     <div className="section-divider-line" />
//                   </div>
//                   <div className="info-box">
//                     ℹ️ As a farmer, please provide your National ID and Trade License for verification purposes.
//                   </div>
//                   <div className="field-row">
//                     <div className="field-g">
//                       <label className="field-lbl">National ID <span className="req">*</span></label>
//                       <input name="national_id" className="field-inp" placeholder="National ID number" value={formData.national_id} onChange={handleChange} required />
//                     </div>
//                     <div className="field-g">
//                       <label className="field-lbl">Trade License <span className="req">*</span></label>
//                       <input name="trade_license" className="field-inp" placeholder="Trade license number" value={formData.trade_license} onChange={handleChange} required />
//                     </div>
//                   </div>
//                   <div className="section-divider">
//                     <div className="section-divider-line" />
//                     <span className="section-divider-label">Set Password</span>
//                     <div className="section-divider-line" />
//                   </div>
//                 </>
//               )}

//               <div className="field-g">
//                 <label className="field-lbl">Password <span className="req">*</span></label>
//                 <div className="field-wrap">
//                   <input type={showPass ? 'text' : 'password'} name="password" className="field-inp has-eye" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
//                   <button type="button" className="field-eye-btn" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
//                 </div>
//               </div>

//               <div className="field-g">
//                 <label className="field-lbl">Confirm Password <span className="req">*</span></label>
//                 <div className="field-wrap">
//                   <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" className="field-inp has-eye" placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} required />
//                   <button type="button" className="field-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? '🙈' : '👁️'}</button>
//                 </div>
//               </div>

//               {error && <div className="err-box">⚠️ {error}</div>}

//               <div className="reg-actions">
//                 <button type="button" className="btn-back" onClick={() => setStep(1)}>← Back</button>
//                 <button type="submit" className="btn-submit" disabled={loading}>
//                   {loading ? <><span className="spinner" />Creating account...</> : 'Create Account'}
//                 </button>
//               </div>
//             </form>
//           )}

//           <p className="login-link">
//             Already have an account?{' '}
//             <span onClick={() => navigate('/login')}>Sign in</span>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Register;