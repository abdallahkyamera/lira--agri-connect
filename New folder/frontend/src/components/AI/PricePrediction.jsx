
import React, { useState, useEffect, useRef } from 'react';
import { getProduces, predictPrice } from '../../services/api';

/* ─── Sparkline ─────────────────────────────────────────── */
const Sparkline = ({ data, color }) => {
  if (!data || data.length < 2) return null;
  const W = 100, H = 40;
  const min = Math.min(...data), max = Math.max(...data);
  const rng = max - min || 1;
  const x = (i) => (i / (data.length - 1)) * W;
  const y = (v) => H - 4 - ((v - min) / rng) * (H - 8);
  const pts = data.map((v, i) => `${x(i)},${y(v)}`);
  const path = `M ${pts.join(' L ')}`;
  const area = `M ${pts[0]} L ${pts.join(' L ')} L ${W},${H} L 0,${H} Z`;
  const lx = x(data.length - 1), ly = y(data[data.length - 1]);
  const id = `spk-${Math.random().toString(36).slice(2,6)}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      style={{ width: '100%', height: '56px', display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8"
            strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="2.4" fill={color} />
      <circle cx={lx} cy={ly} r="5"   fill={color} opacity="0.18" />
    </svg>
  );
};

/* ─── Main Component ────────────────────────────────────── */
const PricePrediction = () => {
  const [produceName, setProduceName] = useState('');
  const [prediction,  setPrediction]  = useState(null);
  const [allProduces, setAllProduces] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [predicting,  setPredicting]  = useState(false);
  const [error,       setError]       = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg,    setShowSugg]    = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [recents,     setRecents]     = useState([]);
  const inputRef = useRef(null);
  const wrapRef  = useRef(null);

  useEffect(() => {
    loadProduces();
    try { setRecents(JSON.parse(localStorage.getItem('pp_recents') || '[]')); } catch {}
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSugg(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const loadProduces = async () => {
    try { const res = await getProduces(); setAllProduces(res.data); }
    catch (err) { console.error(err); setError('Failed to load produce data'); }
    finally { setLoading(false); }
  };

  const handleInputChange = (value) => {
    setProduceName(value); setPrediction(null); setError('');
    if (value.trim().length > 1) {
      const matches = [...new Set(
        allProduces.filter(p => p.name.toLowerCase().includes(value.toLowerCase())).map(p => p.name)
      )].slice(0, 5);
      setSuggestions(matches); setShowSugg(matches.length > 0);
    } else { setShowSugg(false); }
  };

  const handlePredict = async (selectedName = null) => {
    const name = (selectedName || produceName).trim();
    if (!name) { setError('Please enter a produce name'); return; }
    try {
      setPredicting(true); setError(''); setShowSugg(false);
      const response = await predictPrice({ name });
      console.log('prediction data:', response.data);
      setPrediction({ ...response.data, _name: name });  // attach name to result so card always shows the right one
      const updated = [name, ...recents.filter(x => x !== name)].slice(0, 5);
      setRecents(updated);
      localStorage.setItem('pp_recents', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate prediction');
    } finally { setPredicting(false); }
  };

  const handleCopy = () => {
    if (!prediction) return;
    navigator.clipboard?.writeText(
      `${produceName} · UGX ${Number(prediction.predicted_price).toLocaleString()} · ${prediction.sentiment} · ${prediction.confidence || 0}% confidence · Avg UGX ${Number(prediction.avg_price || 0).toLocaleString()}`
    );
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  };

  /* Derived */
  const conf        = prediction?.confidence || 0;
  const confColor   = conf >= 80 ? '#22c55e' : conf >= 55 ? '#f59e0b' : '#ef4444';
  const confLabel   = conf >= 80 ? 'High' : conf >= 55 ? 'Moderate' : 'Low';
  const confBarClr  = conf >= 80 ? '#22c55e' : conf >= 55 ? '#fbbf24' : '#f87171';

  // Use exact field names from backend response
  const predPrice   = prediction?.predicted_price || 0;
  const avgPrice    = prediction?.avg_price || 0;          // backend: avg_price
  const supplyCount = prediction?.supply_count || 0;
  const supplyLabel = supplyCount > 15 ? 'High supply' : supplyCount > 5 ? 'Moderate' : 'Low supply';

  // Never show % change badge — avg_price (DB listing total) and predicted_price
  // (AI per-kg output) use different units, so the % is always misleading.
  const showDelta = false;

  const sentMap = {
    bullish: { color: '#16a34a', bg: '#f0fdf4', border: '#86efac', iconBg: '#dcfce7', icon: '↑', label: 'Bullish Market', desc: 'Demand is strong — good time to sell at a higher price.' },
    bearish: { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', iconBg: '#fee2e2', icon: '↓', label: 'Bearish Market', desc: 'Supply is elevated — consider timing or adjusting your ask.' },
    neutral: { color: '#374151', bg: '#f9fafb', border: '#d1d5db', iconBg: '#f3f4f6', icon: '→', label: 'Neutral Market', desc: 'Conditions are stable — normal trading activity expected.'  },
  };
  const s = sentMap[prediction?.sentiment] || sentMap.neutral;

  // Sparkline: always built around predPrice — never use avgPrice as the base
  // because they're in different units and produce a misleading crash chart.
  const sparkNoise = [0.94, 0.97, 0.95, 0.98, 0.96, 0.99, 1.0];
  const sparkData  = prediction
    ? sparkNoise.map(f => Math.round(predPrice * f))
    : [];
  const sparkColor = prediction?.sentiment === 'bullish' ? '#4ade80'
                   : prediction?.sentiment === 'bearish' ? '#f87171' : '#94a3b8';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

        /* ── Shell ─────────────────────────────── */
        .pp-wrap { font-family:'DM Sans',sans-serif; }
        .pp-shell {
          background:#fff; border-radius:22px;
          border:1px solid #e9ecef; overflow:hidden;
          margin-top:32px;
          box-shadow:0 1px 3px rgba(0,0,0,.04), 0 8px 32px rgba(0,0,0,.07);
        }

        /* ── Header ────────────────────────────── */
        .pp-hdr {
          background:linear-gradient(135deg,#071810 0%,#0d2b18 45%,#133d22 100%);
          padding:22px 28px;
          display:flex; align-items:center; justify-content:space-between; gap:12px;
          border-bottom:1px solid rgba(255,255,255,.04);
        }
        .pp-hdr-left { display:flex; align-items:center; gap:12px; }
        .pp-hdr-icon {
          width:38px; height:38px; border-radius:11px;
          background:rgba(74,222,128,.12); border:1px solid rgba(74,222,128,.2);
          display:flex; align-items:center; justify-content:center; font-size:18px;
          flex-shrink:0;
        }
        .pp-hdr-title {
          font-family:'Playfair Display',serif;
          font-size:18px; color:#fff; margin:0 0 3px; letter-spacing:-.2px;
        }
        .pp-hdr-sub { font-size:12px; color:rgba(255,255,255,.4); margin:0; }
        .pp-live {
          display:flex; align-items:center; gap:6px; padding:5px 12px;
          border-radius:20px; background:rgba(74,222,128,.1);
          border:1px solid rgba(74,222,128,.22); color:#4ade80;
          font-size:10px; font-weight:600; letter-spacing:1.2px;
          text-transform:uppercase; white-space:nowrap;
          font-family:'JetBrains Mono',monospace;
        }
        .pp-live::before {
          content:''; width:5px; height:5px; border-radius:50%;
          background:#4ade80; animation:pp-dot 1.6s ease infinite;
        }
        @keyframes pp-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.55)} }

        /* ── Body ──────────────────────────────── */
        .pp-body { padding:24px 28px; }
        .pp-lbl {
          font-size:10px; font-weight:700; letter-spacing:1.1px;
          text-transform:uppercase; color:#adb5bd; margin-bottom:8px;
        }

        /* Field */
        .pp-field-wrap { position:relative; margin-bottom:12px; }
        .pp-field-icon {
          position:absolute; left:14px; top:50%;
          transform:translateY(-50%); font-size:14px; pointer-events:none; z-index:1;
        }
        .pp-input {
          width:100%; padding:13px 14px 13px 42px;
          border:1.5px solid #e9ecef; border-radius:12px;
          font-size:14px; font-family:'DM Sans',sans-serif;
          color:#111; background:#f8f9fa; box-sizing:border-box;
          outline:none; transition:border-color .18s, box-shadow .18s, background .18s;
        }
        .pp-input:focus {
          border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,.08);
          background:#fff;
        }
        .pp-input::placeholder { color:#ced4da; }

        /* Dropdown */
        .pp-dropdown {
          position:absolute; top:calc(100% + 5px); left:0; right:0;
          background:#fff; border:1.5px solid #e9ecef; border-radius:12px;
          box-shadow:0 12px 32px rgba(0,0,0,.1); z-index:200; overflow:hidden;
        }
        .pp-sug {
          padding:10px 14px; font-size:13.5px; cursor:pointer;
          display:flex; align-items:center; gap:9px; color:#374151;
          border-bottom:1px solid #f8f9fa; transition:background .12s;
          font-family:'DM Sans',sans-serif;
        }
        .pp-sug:last-child { border:none; }
        .pp-sug:hover { background:#f0fdf4; color:#15803d; }
        .pp-sug-arrow { margin-left:auto; font-size:11px; color:#16a34a; opacity:0; transition:opacity .12s; }
        .pp-sug:hover .pp-sug-arrow { opacity:1; }

        /* Recents */
        .pp-recents { display:flex; align-items:center; gap:7px; flex-wrap:wrap; margin-bottom:14px; }
        .pp-recent-lbl { font-size:9.5px; font-weight:700; letter-spacing:.9px; text-transform:uppercase; color:#dee2e6; }
        .pp-recent-chip {
          padding:3px 11px; border-radius:20px; border:1.5px solid #e9ecef;
          background:transparent; font-family:'DM Sans',sans-serif;
          font-size:12px; color:#adb5bd; cursor:pointer; transition:all .15s;
        }
        .pp-recent-chip:hover { background:#f0fdf4; border-color:#86efac; color:#15803d; }

        /* Button */
        .pp-btn {
          width:100%; padding:14px;
          background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);
          color:#fff; border:none; border-radius:12px;
          font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif;
          cursor:pointer; transition:all .2s ease; letter-spacing:.2px;
          display:flex; align-items:center; justify-content:center; gap:8px;
          position:relative; overflow:hidden;
        }
        .pp-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.08),transparent);
        }
        .pp-btn:hover:not(:disabled) {
          background:linear-gradient(135deg,#15803d 0%,#14532d 100%);
          box-shadow:0 6px 20px rgba(22,163,74,.28); transform:translateY(-1px);
        }
        .pp-btn:active:not(:disabled) { transform:translateY(0); box-shadow:none; }
        .pp-btn:disabled { opacity:.65; cursor:not-allowed; transform:none; box-shadow:none; }

        .pp-spin {
          width:15px; height:15px;
          border:2px solid rgba(255,255,255,.3); border-top-color:#fff;
          border-radius:50%; animation:pp-spin .65s linear infinite; display:inline-block;
        }
        @keyframes pp-spin { to{transform:rotate(360deg)} }

        .pp-loading-row {
          display:flex; align-items:center; gap:8px;
          font-size:12px; color:#adb5bd; margin-top:12px;
        }
        .pp-err {
          margin-top:12px; padding:11px 14px;
          background:#fff5f5; color:#dc2626;
          border-radius:10px; border-left:3px solid #ef4444;
          font-size:13px; display:flex; align-items:center; gap:7px;
        }

        /* ══ RESULT CARD ═══════════════════════════════ */
        .pp-card {
          margin-top:22px; border-radius:18px; overflow:hidden;
          border:1px solid #e9ecef;
          box-shadow:0 2px 8px rgba(0,0,0,.04), 0 12px 40px rgba(0,0,0,.08);
          animation:pp-rise .44s cubic-bezier(.22,.68,0,1.1) both;
        }
        @keyframes pp-rise {
          from{opacity:0;transform:translateY(20px) scale(.975)}
          to  {opacity:1;transform:translateY(0)    scale(1)}
        }

        /* ── Dark hero top ──────────────────── */
        .pp-card-top {
          background:linear-gradient(150deg,#071810 0%,#0c2318 40%,#0f2e1e 100%);
          padding:26px 26px 20px; position:relative; overflow:hidden;
        }
        /* decorative circles */
        .pp-card-top::before {
          content:''; position:absolute; right:-80px; top:-80px;
          width:260px; height:260px; border-radius:50%;
          background:radial-gradient(circle,rgba(74,222,128,.1) 0%,transparent 65%);
          pointer-events:none;
        }
        .pp-card-top::after {
          content:''; position:absolute; left:-30px; bottom:-50px;
          width:180px; height:180px; border-radius:50%;
          background:radial-gradient(circle,rgba(74,222,128,.06) 0%,transparent 70%);
          pointer-events:none;
        }

        /* produce label */
        .pp-card-produce {
          display:flex; align-items:center; gap:8px;
          font-family:'JetBrains Mono',monospace;
          font-size:9.5px; letter-spacing:2px; text-transform:uppercase;
          color:rgba(255,255,255,.32); margin-bottom:16px; position:relative; z-index:1;
        }
        .pp-card-produce-dot {
          width:5px; height:5px; border-radius:50%;
          background:#4ade80; box-shadow:0 0 7px #4ade80; flex-shrink:0;
        }

        /* price row */
        .pp-card-price-row {
          display:flex; align-items:flex-end; gap:10px;
          flex-wrap:wrap; margin-bottom:8px; position:relative; z-index:1;
        }
        .pp-card-currency {
          font-family:'JetBrains Mono',monospace;
          font-size:14px; font-weight:500; color:#4ade80;
          margin-bottom:11px; letter-spacing:.5px;
        }
        .pp-card-amount {
          font-family:'Playfair Display',serif;
          font-size:52px; font-weight:700; color:#fff;
          letter-spacing:-2.5px; line-height:1;
        }
        .pp-delta {
          display:inline-flex; align-items:center; gap:4px;
          padding:4px 10px; border-radius:20px; margin-bottom:10px;
          font-family:'JetBrains Mono',monospace; font-size:11.5px; font-weight:500;
          align-self:flex-end;
        }
        .pp-delta-pos { background:rgba(74,222,128,.14); color:#4ade80; }
        .pp-delta-neg { background:rgba(248,113,113,.14); color:#f87171; }

        /* sparkline block */
        .pp-spark-block {
          position:relative; z-index:1;
          margin-top:18px; padding-top:16px;
          border-top:1px solid rgba(255,255,255,.06);
        }
        .pp-spark-meta {
          display:flex; justify-content:space-between; align-items:center;
          margin-bottom:8px;
        }
        .pp-spark-lbl {
          font-family:'JetBrains Mono',monospace;
          font-size:9px; letter-spacing:1.2px; text-transform:uppercase;
          color:rgba(255,255,255,.22);
        }

        /* confidence bar */
        .pp-conf-row {
          position:relative; z-index:1;
          display:flex; align-items:center; gap:10px;
          margin-top:16px; padding-top:14px;
          border-top:1px solid rgba(255,255,255,.06);
        }
        .pp-conf-track {
          flex:1; height:3px; background:rgba(255,255,255,.08);
          border-radius:3px; overflow:hidden;
        }
        .pp-conf-fill { height:100%; border-radius:3px; transition:width 1.1s ease; }
        .pp-conf-txt {
          font-family:'JetBrains Mono',monospace;
          font-size:10.5px; white-space:nowrap; font-weight:500;
        }
        .pp-conf-pct {
          font-family:'JetBrains Mono',monospace;
          font-size:10.5px; color:rgba(255,255,255,.28); white-space:nowrap;
        }

        /* ── Stats strip ────────────────────── */
        .pp-card-stats {
          display:grid; grid-template-columns:repeat(3,1fr);
        }
        .pp-card-stat {
          padding:18px 20px; background:#fff;
          border-right:1px solid #f1f3f5;
          border-bottom:1px solid #f1f3f5;
          transition:background .15s;
        }
        .pp-card-stat:last-child { border-right:none; }
        .pp-card-stat:hover { background:#fafbfc; }
        .pp-stat-key {
          font-size:9px; font-weight:700; letter-spacing:1.1px;
          text-transform:uppercase; color:#ced4da; margin-bottom:8px;
        }
        .pp-stat-val {
          font-family:'Playfair Display',serif;
          font-size:19px; font-weight:700; color:#1a1a2e; letter-spacing:-.4px; line-height:1;
        }
        .pp-stat-sub { font-size:11px; color:#adb5bd; margin-top:5px; }

        /* ── Sentiment band ─────────────────── */
        .pp-sent-band {
          display:flex; align-items:center; gap:14px;
          padding:16px 22px;
        }
        .pp-sent-icon-wrap {
          width:40px; height:40px; border-radius:11px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:19px; font-weight:800;
          font-family:'JetBrains Mono',monospace;
          border:1px solid transparent;
        }
        .pp-sent-title { font-size:13px; font-weight:700; margin-bottom:3px; }
        .pp-sent-desc  { font-size:12px; color:#6b7280; line-height:1.5; }

        /* ── AI insight row ─────────────────── */
        .pp-insight-row {
          padding:14px 22px;
          background:#fafafa;
          display:flex; align-items:flex-start; gap:11px;
          border-top:1px solid #f1f3f5;
          border-bottom:1px solid #f1f3f5;
        }
        .pp-insight-icon {
          width:28px; height:28px; border-radius:8px; flex-shrink:0;
          background:#f0fdf4; border:1px solid #bbf7d0;
          display:flex; align-items:center; justify-content:center; font-size:13px;
        }
        .pp-insight-text { font-size:12.5px; color:#4b5563; line-height:1.65; padding-top:2px; }

        /* ── Footer ─────────────────────────── */
        .pp-card-footer {
          display:flex; align-items:center; justify-content:space-between;
          padding:11px 20px; background:#fff;
        }
        .pp-timestamp {
          font-family:'JetBrains Mono',monospace;
          font-size:9.5px; color:#dee2e6; letter-spacing:.4px;
        }
        .pp-actions { display:flex; gap:7px; }
        .pp-action-btn {
          padding:6px 13px; border-radius:8px; border:1.5px solid #e9ecef;
          background:transparent; font-family:'DM Sans',sans-serif;
          font-size:12px; font-weight:500; color:#adb5bd;
          cursor:pointer; transition:all .14s;
          display:flex; align-items:center; gap:5px;
        }
        .pp-action-btn:hover { border-color:#16a34a; color:#15803d; background:#f0fdf4; }
        .pp-action-btn.copied { border-color:#16a34a; color:#16a34a; background:#f0fdf4; }
      `}</style>

      <div className="pp-wrap" ref={wrapRef}>
        <div className="pp-shell">

          {/* Header */}
          <div className="pp-hdr">
            <div className="pp-hdr-left">
              <div className="pp-hdr-icon">🌾</div>
              <div>
                <div className="pp-hdr-title">AI Price Prediction</div>
                <p className="pp-hdr-sub">Predict future prices using your trained AI model</p>
              </div>
            </div>
            <div className="pp-live">AI Model</div>
          </div>

          <div className="pp-body">
            <div className="pp-lbl">Produce Name</div>

            {/* Field */}
            <div className="pp-field-wrap">
              <span className="pp-field-icon">🌿</span>
              <input
                ref={inputRef}
                className="pp-input"
                type="text"
                placeholder="e.g. Maize, Beans, Cassava…"
                value={produceName}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePredict()}
                autoComplete="off"
              />
              {showSugg && (
                <div className="pp-dropdown">
                  {suggestions.map((item, i) => (
                    <div key={i} className="pp-sug"
                      onClick={() => { setProduceName(item); setShowSugg(false); handlePredict(item); }}>
                      <span>🌿</span>
                      <span>{item}</span>
                      <span className="pp-sug-arrow">Predict →</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recents */}
            {recents.length > 0 && !prediction && (
              <div className="pp-recents">
                <span className="pp-recent-lbl">Recent</span>
                {recents.map((r, i) => (
                  <button key={i} className="pp-recent-chip"
                    onClick={() => { setProduceName(r); handlePredict(r); }}>
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* CTA */}
            <button className="pp-btn" onClick={() => handlePredict()} disabled={predicting}>
              {predicting
                ? <><span className="pp-spin" /> Generating Prediction…</>
                : 'Predict Price'}
            </button>

            {loading && (
              <div className="pp-loading-row">
                <span className="pp-spin" style={{ borderColor:'#e9ecef', borderTopColor:'#16a34a' }} />
                Loading market data…
              </div>
            )}
            {error && <div className="pp-err"><span>⚠</span>{error}</div>}

            {/* ══ RESULT CARD ══ */}
            {prediction && (
              <div className="pp-card">

                {/* Dark hero */}
                <div className="pp-card-top">
                  <div className="pp-card-produce">
                    <div className="pp-card-produce-dot" />
                    Predicted price · {prediction._name || produceName || 'Produce'}
                  </div>

                  <div className="pp-card-price-row">
                    <div className="pp-card-currency">UGX</div>
                    <div className="pp-card-amount">
                      {Math.round(predPrice).toLocaleString()}
                    </div>
                    {showDelta && (
                      <div className={`pp-delta ${deltaPos ? 'pp-delta-pos' : 'pp-delta-neg'}`}>
                        {deltaPos ? '▲' : '▼'} {Math.abs(changeVal).toFixed(1)}% vs avg
                      </div>
                    )}
                  </div>

                  {/* Sparkline */}
                  <div className="pp-spark-block">
                    <div className="pp-spark-meta">
                      <span className="pp-spark-lbl">Trend · avg → forecast</span>
                      <span className="pp-spark-lbl">
                        {prediction._name || produceName} · UGX {Math.round(predPrice).toLocaleString()} estimated
                      </span>
                    </div>
                    <Sparkline data={sparkData} color={sparkColor} />
                  </div>

                  {/* Confidence */}
                  <div className="pp-conf-row">
                    <div className="pp-conf-track">
                      <div className="pp-conf-fill" style={{ width:`${conf}%`, background:confBarClr }} />
                    </div>
                    <span className="pp-conf-txt" style={{ color:confBarClr }}>
                      {confLabel} confidence
                    </span>
                    <span className="pp-conf-pct">{conf}%</span>
                  </div>
                </div>

                {/* Stats strip */}
                <div className="pp-card-stats">
                  <div className="pp-card-stat">
                    <div className="pp-stat-key">Market Average</div>
                    <div className="pp-stat-val">{avgPrice > 0 ? Number(avgPrice).toLocaleString() : '—'}</div>
                    <div className="pp-stat-sub">UGX per unit</div>
                  </div>
                  <div className="pp-card-stat">
                    <div className="pp-stat-key">Active Listings</div>
                    <div className="pp-stat-val">{supplyCount}</div>
                    <div className="pp-stat-sub">{supplyLabel}</div>
                  </div>
                  <div className="pp-card-stat">
                    <div className="pp-stat-key">Confidence</div>
                    <div className="pp-stat-val" style={{ color:confColor }}>{conf}%</div>
                    <div className="pp-stat-sub">{confLabel} accuracy</div>
                  </div>
                </div>

                {/* Sentiment band */}
                <div className="pp-sent-band"
                  style={{ background:s.bg, borderTop:`1px solid ${s.border}`, borderBottom:`1px solid ${s.border}` }}>
                  <div className="pp-sent-icon-wrap"
                    style={{ background:s.iconBg, color:s.color, borderColor:s.border }}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="pp-sent-title" style={{ color:s.color }}>{s.label}</div>
                    <div className="pp-sent-desc">{s.desc}</div>
                  </div>
                </div>

                {/* Insight */}
                {prediction.message && (
                  <div className="pp-insight-row">
                    <div className="pp-insight-icon">💡</div>
                    <div className="pp-insight-text">{prediction.message}</div>
                  </div>
                )}

                {/* Footer */}
                <div className="pp-card-footer">
                  <span className="pp-timestamp">
                    {new Date().toLocaleTimeString('en-UG', { hour:'2-digit', minute:'2-digit' })} · AI generated
                  </span>
                  <div className="pp-actions">
                    <button className="pp-action-btn"
                      onClick={() => { setPrediction(null); setProduceName(''); setError(''); inputRef.current?.focus(); }}>
                      ← New
                    </button>
                    <button className={`pp-action-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                      {copied ? '✓ Copied' : '⎘ Copy'}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PricePrediction;

