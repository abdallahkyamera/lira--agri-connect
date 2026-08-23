
import React, { useState, useEffect } from 'react';
import { getProduces } from '../../services/api';
import PricePrediction from '../AI/PricePrediction';
// import WeatherWidget from '../Weather/WeatherWidget';
import Footer from '../Layout/Footer';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getMediaUrl } from '../utils/mediaUrl';
// import InAppChat from "./components/Dashboard/InAppChat"; 
// // import InAppChat from '../InAppChat';

const BuyerDashboard = () => {
  const [produces, setProduces] = useState([]);
  const [filteredProduces, setFilteredProduces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('price-low');
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid | map

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Tubers', 'Legumes', 'Livestock', 'Dairy', 'Others'];

  const categoryIcons = {
    Vegetables: '🥬', Fruits: '🍍', Grains: '🌾', Tubers: '🥔',
    Legumes: '🫘', Livestock: '🐄', Dairy: '🥛', Others: '📦'
  };

  useEffect(() => { fetchProduces(); }, []);

  const fetchProduces = async () => {
    try {
      const res = await getProduces();
      setProduces(res.data);
      setFilteredProduces(res.data);
    } catch (err) {
      console.error('Failed to load produces', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...produces];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.farmer?.username?.toLowerCase().includes(term)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case 'price-high': result.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case 'quantity-high': result.sort((a, b) => Number(b.quantity) - Number(a.quantity)); break;
      case 'newest': result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
    }
    setFilteredProduces(result);
  }, [produces, searchTerm, selectedCategory, sortBy]);

  const openContact = (produce) => setSelectedProduce(produce);

  const openWhatsApp = (phone, produceName) => {
    const message = `Hello, I'm interested in your ${produceName}. Is it still available?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const submitRating = async () => {
    if (rating === 0) return alert('Please select a rating');
    alert('Thank you for your feedback!');
    setShowRatingModal(false);
    setRating(0);
    setFeedback('');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .buyer-page {
          min-height: 100vh;
          background: #f4f6f4;
          font-family: 'DM Sans', sans-serif;
        }

        /* Hero */
        .buyer-hero {
          background: linear-gradient(135deg, #0f3620 0%, #1a5c34 60%, #0d4a24 100%);
          padding: 48px 40px 80px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .buyer-hero::before {
          content: '';
          position: absolute;
          bottom: -50px; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 200px;
          background: radial-gradient(ellipse, rgba(74,222,128,0.1) 0%, transparent 70%);
        }
        .buyer-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(74,222,128,0.15);
          border: 1px solid rgba(74,222,128,0.25);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #4ade80;
          margin-bottom: 16px;
        }
        .buyer-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 44px;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 12px;
        }
        .buyer-hero-title em { color: #4ade80; font-style: italic; }
        .buyer-hero-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 32px;
        }
        .buyer-hero-quick-stats {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .buyer-hero-stat {
          text-align: center;
        }
        .buyer-hero-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #4ade80;
        }
        .buyer-hero-stat-label { font-size: 12px; color: rgba(255,255,255,0.5); }

        /* Main */
        .buyer-main {
          max-width: 1280px;
          margin: -40px auto 60px;
          padding: 0 40px;
          position: relative;
          z-index: 10;
        }

        /* Filter Bar */
        .filter-card {
          background: #fff;
          border-radius: 16px;
          padding: 18px 22px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .filter-search {
          flex: 1;
          min-width: 200px;
          padding: 11px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.2s;
          background: #fafafa;
        }
        .filter-search:focus { border-color: #16a34a; background: #fff; }
        .filter-select {
          padding: 11px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
          background: #fafafa;
          cursor: pointer;
          color: #374151;
        }
        .filter-select:focus { border-color: #16a34a; }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: #f3f4f6;
          border-radius: 10px;
          padding: 4px;
        }
        .view-btn {
          padding: 7px 16px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #6b7280;
          font-weight: 500;
        }
        .view-btn.active {
          background: #fff;
          color: #0f361c;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .rate-btn {
          padding: 10px 18px;
          background: #fefce8;
          border: 1.5px solid #fde68a;
          border-radius: 10px;
          color: #92400e;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .rate-btn:hover { background: #fef9c3; }

        /* Category Pills */
        .cat-pills {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          margin-bottom: 24px;
          scrollbar-width: none;
        }
        .cat-pills::-webkit-scrollbar { display: none; }
        .cat-pill {
          padding: 8px 18px;
          border-radius: 30px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          color: #6b7280;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cat-pill:hover { border-color: #86efac; color: #16a34a; }
        .cat-pill.active {
          background: #f0fdf4;
          border-color: #16a34a;
          color: #16a34a;
          font-weight: 600;
        }

        /* Map Card */
        .map-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
          margin-bottom: 28px;
          border: 1px solid #f0f0f0;
        }
        .map-card-header {
          padding: 16px 22px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .map-card-title {
          font-size: 15px;
          font-weight: 600;
          color: #0f361c;
        }
        .map-live-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #16a34a;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

        /* Section Header */
        .section-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 18px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #0f361c;
        }
        .section-count {
          font-size: 13px;
          color: #9ca3af;
          background: #f3f4f6;
          padding: 2px 10px;
          border-radius: 20px;
        }

        /* Produce Grid */
        .produce-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 48px;
        }
        .produce-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.25s;
          display: flex;
          flex-direction: column;
        }
        .produce-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
          border-color: #bbf7d0;
        }
        .produce-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .produce-img-placeholder {
          width: 100%;
          height: 180px;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }
        .produce-body { padding: 18px; flex: 1; display: flex; flex-direction: column; }
        .produce-category-tag {
          display: inline-block;
          padding: 3px 10px;
          background: #f0fdf4;
          color: #16a34a;
          font-size: 11px;
          font-weight: 600;
          border-radius: 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .produce-title {
          font-size: 16px;
          font-weight: 600;
          color: #0f361c;
          margin-bottom: 4px;
        }
        .produce-price {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 12px;
        }
        .produce-price span {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #9ca3af;
        }
        .produce-meta { margin-bottom: 16px; }
        .produce-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #6b7280;
          padding: 3px 0;
        }
        .produce-meta-row strong { color: #374151; }
        .contact-btn {
          margin-top: auto;
          padding: 12px;
          background: linear-gradient(135deg, #166534, #15803d);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .contact-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22,101,52,0.3); }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(4px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-card {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 420px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
          animation: modalIn 0.25s ease;
        }
        @keyframes modalIn { from { opacity:0; transform: scale(0.95) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }
        .modal-header {
          background: linear-gradient(135deg, #0f3620, #1a5c34);
          padding: 24px;
          color: #fff;
        }
        .modal-header-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; margin-bottom: 4px; }
        .modal-header-sub { font-size: 13px; color: rgba(255,255,255,0.6); }
        .modal-body { padding: 24px; }
        .modal-info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
        }
        .modal-info-row:last-child { border-bottom: none; }
        .modal-info-label { color: #9ca3af; }
        .modal-info-val { font-weight: 600; color: #1f2937; }
        .modal-actions { padding: 0 24px 24px; display: flex; flex-direction: column; gap: 10px; }
        .modal-wa-btn {
          padding: 14px;
          background: #25D366;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .modal-wa-btn:hover { background: #1fb955; }
        .modal-call-btn {
          padding: 14px;
          background: #f0fdf4;
          color: #166534;
          border: 2px solid #bbf7d0;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .modal-call-btn:hover { background: #dcfce7; }
        .modal-close-btn {
          padding: 12px;
          background: #f9fafb;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .modal-close-btn:hover { background: #f3f4f6; }

        /* Rating Modal */
        .rating-stars {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 20px 0;
        }
        .star {
          font-size: 42px;
          cursor: pointer;
          transition: transform 0.15s;
          filter: grayscale(1);
        }
        .star.lit { filter: none; }
        .star:hover { transform: scale(1.15); }
        .rating-textarea {
          width: 100%;
          padding: 12px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
          resize: vertical;
          min-height: 90px;
          margin-bottom: 16px;
        }
        .rating-textarea:focus { border-color: #16a34a; }
        .rating-submit {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #166534, #15803d);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 10px;
        }

        .empty-category {
          padding: 48px 20px;
          text-align: center;
          background: #fff;
          border-radius: 16px;
          border: 1px dashed #e5e7eb;
        }
        .empty-category-icon { font-size: 40px; margin-bottom: 12px; }

        @media (max-width: 768px) {
          .buyer-hero-title { font-size: 30px; }
          .buyer-main { padding: 0 20px; }
          .produce-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="buyer-page">
        {/* Hero */}
        <div className="buyer-hero">
          <div className="buyer-hero-eyebrow">🌱 Fresh · Local · Direct</div>
          <h1 className="buyer-hero-title">
            Lira Agri-Connect<br />
            <em>Marketplace</em>
          </h1>
          <p className="buyer-hero-sub">Fresh produce — direct from farmers in Lira District</p>
          <div className="buyer-hero-quick-stats">
            {[
              { num: `${produces.length}+`, label: 'Listings' },
              { num: '500+', label: 'Active Farmers' },
              { num: '8', label: 'Districts' },
            ].map(s => (
              <div key={s.label} className="buyer-hero-stat">
                <div className="buyer-hero-stat-num">{s.num}</div>
                <div className="buyer-hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="buyer-main">
          {/* <WeatherWidget /> */}

          {/* Filter Bar */}
          <div className="filter-card">
            <input
              type="text"
              className="filter-search"
              placeholder="🔍  Search produce or farmer..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="quantity-high">Highest Quantity</option>
              <option value="newest">Newest First</option>
            </select>
            <div className="view-toggle">
              <button className={`view-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')}>🗂 Grid</button>
              <button className={`view-btn${viewMode === 'map' ? ' active' : ''}`} onClick={() => setViewMode('map')}>🗺 Map</button>
            </div>
            <button className="rate-btn" onClick={() => setShowRatingModal(true)}>⭐ Rate App</button>
          </div>


          {/* Category Pills */}
          <div className="cat-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-pill${selectedCategory === cat ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat !== 'All' && categoryIcons[cat]} {cat}
              </button>
            ))}
          </div>

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="map-card" style={{ marginBottom: '28px' }}>
              <div className="map-card-header">
                <div className="map-live-dot" />
                <span className="map-card-title">Live Farmers Map — Lira Region</span>
                <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#9ca3af' }}>
                  {filteredProduces.length} farmers shown
                </span>
              </div>
              <MapContainer center={[2.25, 32.85]} zoom={12} style={{ height: '450px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredProduces.map((p, idx) => (
                  <Marker key={p.id} position={[2.25 + idx * 0.012, 32.85 + idx * 0.018]}>
                    <Popup>
                      <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        <strong>{p.name}</strong><br />
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>UGX {Number(p.price).toLocaleString()}</span><br />
                        Qty: {p.quantity} {p.unit}<br />
                        Farmer: {p.farmer?.username}<br /><br />
                        <button
                          onClick={() => openContact(p)}
                          style={{ width: '100%', padding: '8px', background: '#166534', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Contact Farmer
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            categories.filter(cat => cat !== 'All').map(category => {
              const items = filteredProduces.filter(p => p.category === category);
              if (items.length === 0 && selectedCategory !== 'All' && selectedCategory !== category) return null;
              if (items.length === 0 && selectedCategory === 'All') return null;
              if (items.length === 0) return (
                <div key={category} className="empty-category" style={{ marginBottom: '24px' }}>
                  <div className="empty-category-icon">{categoryIcons[category]}</div>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>No {category.toLowerCase()} available right now</p>
                </div>
              );
              return (
                <div key={category} style={{ marginBottom: '48px' }}>
                  <div className="section-header">
                    <span style={{ fontSize: '22px' }}>{categoryIcons[category]}</span>
                    <h2 className="section-title">{category}</h2>
                    <span className="section-count">{items.length}</span>
                  </div>
                  <div className="produce-grid">
                    {items.map(p => (
                      <div key={p.id} className="produce-card">
                        {p.image
                          ? <img src={getMediaUrl(p.image)} alt={p.name} className="produce-img" />
                          : <div className="produce-img-placeholder">{categoryIcons[p.category] || '🌾'}</div>
                        }
                        <div className="produce-body">
                          <span className="produce-category-tag">{p.category}</span>
                          <div className="produce-title">{p.name}</div>
                          <div className="produce-price">
                            UGX {Number(p.price).toLocaleString()}
                            <span> / {p.unit}</span>
                          </div>
                          <div className="produce-meta">
                            <div className="produce-meta-row">
                              <span>Available Qty</span>
                              <strong>{p.quantity} {p.unit}</strong>
                            </div>
                            <div className="produce-meta-row">
                              <span>Farmer</span>
                              <strong>{p.farmer?.username || '—'}</strong>
                            </div>
                            <div className="produce-meta-row">
                              <span>Location</span>
                              <strong>{p.district || 'Lira District'}</strong>
                            </div>
                          </div>
                          <button className="contact-btn" onClick={() => openContact(p)}>
                            Contact Farmer →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {/* Chat Section
      <div style={{ marginTop: '40px' }}>
        <h2>💬 Chat with Farmer</h2>
        <InAppChat 
          currentUser="buyer"
          partnerName="Joseph Farm"
          partnerRole="Farmer"
          productName="Fresh Tomatoes - 50kg"
        />
      </div> */}

          <PricePrediction />
        </div>

        {/* Contact Modal */}
        {selectedProduce && (
          <div className="modal-overlay" onClick={() => setSelectedProduce(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-header-title">Contact Farmer</div>
                <div className="modal-header-sub">Reach out about this produce</div>
              </div>
              <div className="modal-body">
                <div className="modal-info-row">
                  <span className="modal-info-label">Produce</span>
                  <span className="modal-info-val">{selectedProduce.name}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Farmer</span>
                  <span className="modal-info-val">{selectedProduce.farmer?.username}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Price</span>
                  <span className="modal-info-val" style={{ color: '#16a34a' }}>UGX {Number(selectedProduce.price).toLocaleString()} / {selectedProduce.unit}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Location</span>
                  <span className="modal-info-val">{selectedProduce.district || 'Lira District'}</span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="modal-wa-btn" onClick={() => openWhatsApp(selectedProduce.farmer?.phone, selectedProduce.name)}>
                  💬 Chat on WhatsApp
                </button>
                <button className="modal-call-btn" onClick={() => window.location.href = `tel:${selectedProduce.farmer?.phone}`}>
                  📞 Call Farmer
                </button>
                <button className="modal-close-btn" onClick={() => setSelectedProduce(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-header-title">Rate Lira Agri-Connect</div>
                <div className="modal-header-sub">Help us improve the platform</div>
              </div>
              <div className="modal-body">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span
                      key={i}
                      className={`star${i <= rating ? ' lit' : ''}`}
                      onClick={() => setRating(i)}
                    >⭐</span>
                  ))}
                </div>
                <textarea
                  className="rating-textarea"
                  placeholder="What could we do better? (optional)"
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
                <button className="rating-submit" onClick={submitRating}>Submit Rating</button>
                <button className="modal-close-btn" onClick={() => setShowRatingModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default BuyerDashboard;

