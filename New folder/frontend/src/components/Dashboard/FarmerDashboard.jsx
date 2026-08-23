
import React, { useState, useEffect } from 'react';
import {
  getMyProduces,
  createProduce,
  updateProduce,
  deleteProduce
} from '../../services/api';
import PricePrediction from '../AI/PricePrediction';
// import WeatherWidget from '../Weather/WeatherWidget';
import { getMediaUrl } from '../utils/mediaUrl';
// import InAppChat from './pages/InAppChat'; 
// import InAppChat from '../components/Dashboard/I';






const FarmerDashboard = () => {
  const [produces, setProduces] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduce, setEditingProduce] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '', category: 'Vegetables', quantity: '', unit: 'kg', price: '',
    description: '', status: 'available', district: '', sub_county: '', village: '',
    images: []
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  useEffect(() => { fetchMyProduces(); }, []);

  const fetchMyProduces = async () => {
    try {
      const res = await getMyProduces();
      setProduces(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load your produces');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('quantity', parseFloat(formData.quantity) || 0);
    data.append('unit', formData.unit);
    data.append('price', parseFloat(formData.price) || 0);
    data.append('description', formData.description);
    data.append('status', formData.status);
    data.append('district', formData.district);
    data.append('sub_county', formData.sub_county);
    data.append('village', formData.village);
    formData.images.forEach(img => data.append('image', img));
    if (editingProduce && imagesToDelete.length > 0) {
      data.append('imagesToDelete', JSON.stringify(imagesToDelete));
    }

    try {
      if (editingProduce) {
        await updateProduce(editingProduce.id, data);
        setSuccess('Produce updated successfully!');
      } else {
        await createProduce(data);
        setSuccess('Produce registered successfully!');
      }
      resetForm();
      setShowForm(false);
      setEditingProduce(null);
      fetchMyProduces();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      const errorMsg = err.response?.data?.error ||
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).flat().join(', ') ||
        'Operation failed. Please check your inputs.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', category: 'Vegetables', quantity: '', unit: 'kg', price: '',
      description: '', status: 'available', district: '', sub_county: '', village: '', images: []
    });
    setExistingImages([]);
    setImagesToDelete([]);
    setImagePreviewUrls([]);
    setError('');
  };

  const handleEdit = (produce) => {
    setEditingProduce(produce);
    setFormData({
      name: produce.name, category: produce.category || 'Vegetables',
      quantity: produce.quantity?.toString() || '', unit: produce.unit,
      price: produce.price?.toString() || '', description: produce.description || '',
      status: produce.status, district: produce.district || '',
      sub_county: produce.sub_county || '', village: produce.village || '', images: []
    });
    setExistingImages(getMediaUrl(produce.image_urls) || getMediaUrl(produce.images) || []);
    setImagesToDelete([]);
    setImagePreviewUrls([]);
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImagePreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index, imageUrl) => {
    setImagesToDelete(prev => [...prev, imageUrl]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this produce?')) {
      try {
        await deleteProduce(id);
        setSuccess('Produce deleted');
        fetchMyProduces();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete produce');
      }
    }
  };
  console.log(produces)
  const username = localStorage.getItem('username') || 'Farmer';
  const totalValue = produces.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity)), 0);
  const available = produces.filter(p => p.status === 'available').length;

  const statusStyle = (s) => ({
    available: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    sold: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    unavailable: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  }[s] || { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' });

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Tubers', 'Legumes', 'Livestock', 'Dairy', 'Others'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .farmer-page {
          min-height: 100vh;
          background: #f4f6f4;
          font-family: 'DM Sans', sans-serif;
        }

        /* Header */
        .farmer-header {
          background: linear-gradient(135deg, #0f3620 0%, #1a5c34 60%, #0d4a24 100%);
          padding: 40px 40px 70px;
          position: relative;
          overflow: hidden;
        }
        .farmer-header::after {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .farmer-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        .farmer-welcome {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .farmer-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
        }
        .farmer-header-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
        }
        .btn-add {
          padding: 12px 24px;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          color: #0f361c;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(74,222,128,0.4);
        }

        /* Main */
        .farmer-main {
          max-width: 1280px;
          margin: -40px auto 60px;
          padding: 0 40px;
          position: relative;
          z-index: 10;
        }

        /* Stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .stat-box {
          background: #fff;
          border-radius: 14px;
          padding: 20px 22px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .stat-box-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .stat-box-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 4px;
        }
        .stat-box-val {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #0f361c;
          line-height: 1;
        }
        .stat-box-val.green { color: #16a34a; }
        .stat-box-sub { font-size: 12px; color: #9ca3af; margin-top: 3px; }

        /* Toast */
        .toast {
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }
        .toast.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .toast.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

        /* Card */
        .form-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .form-card-header {
          padding: 18px 24px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .form-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f361c;
        }
        .form-card-body { padding: 28px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
        .form-full { grid-column: 1 / -1; }
        .form-field { display: flex; flex-direction: column; gap: 7px; }
        .form-lbl { font-size: 13px; font-weight: 500; color: #374151; }
        .form-req { color: #dc2626; margin-left: 2px; }
        .form-inp {
          padding: 11px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: #fafafa;
          color: #1f2937;
          outline: none;
          transition: all 0.2s;
          width: 100%;
        }
        .form-inp:focus { border-color: #16a34a; background: #fff; }
        textarea.form-inp { resize: vertical; min-height: 90px; }

        .section-divider-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 24px 0 18px;
        }
        .section-divider-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #f0f0f0;
        }

        /* Image Upload */
        .img-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
          position: relative;
          overflow: hidden;
        }
        .img-upload-area:hover { border-color: #86efac; background: #f0fdf4; }
        .img-upload-area input[type=file] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }
        .img-upload-icon { font-size: 32px; margin-bottom: 8px; }
        .img-upload-label { font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px; }
        .img-upload-sub { font-size: 12px; color: #9ca3af; }

        .img-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .img-thumb {
          position: relative;
          width: 90px; height: 90px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
        }
        .img-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .img-remove {
          position: absolute;
          top: 4px; right: 4px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(0,0,0,0.6);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          transition: background 0.2s;
        }
        .img-remove:hover { background: #dc2626; }

        .form-actions {
          display: flex;
          gap: 12px;
          padding-top: 8px;
        }
        .btn-submit {
          flex: 1;
          padding: 13px;
          background: linear-gradient(135deg, #166534, #15803d);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22,101,52,0.3); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-cancel {
          padding: 13px 28px;
          background: #fff;
          color: #6b7280;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel:hover { border-color: #9ca3af; }
        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Table Card */
        .table-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
          overflow: hidden;
          margin: 20px
          
        }
        .table-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .table-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f361c;
        }
        .table-count {
          font-size: 13px;
          color: #9ca3af;
          background: #f3f4f6;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #fafafa; }
        th {
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #9ca3af;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
          white-space: nowrap;
        }
        td {
          padding: 14px 16px;
          font-size: 14px;
          color: #374151;
          border-bottom: 1px solid #f9fafb;
          vertical-align: middle;
        }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:hover { background: #fafafa; }

        .table-img {
          width: 52px; height: 52px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid #e5e7eb;
        }
        .table-img-placeholder {
          width: 52px; height: 52px;
          border-radius: 10px;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          border: 1px solid #e5e7eb;
        }
        .produce-name-cell { font-weight: 600; color: #0f361c; }
        .cat-tag {
          display: inline-block;
          padding: 2px 8px;
          background: #f0fdf4;
          color: #16a34a;
          font-size: 11px;
          font-weight: 600;
          border-radius: 20px;
          margin-top: 2px;
        }
        .price-cell { font-weight: 600; color: #16a34a; font-family: 'Playfair Display', serif; }
        .status-chip {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid;
          text-transform: capitalize;
        }
        .action-cell { display: flex; gap: 8px; }
        .btn-edit {
          padding: 6px 14px;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-edit:hover { background: #dbeafe; }
        .btn-del {
          padding: 6px 14px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-del:hover { background: #fee2e2; }

        .empty-row td {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }
        .empty-row-icon { font-size: 48px; display: block; margin-bottom: 12px; }
        .empty-row-title { font-size: 16px; font-weight: 600; color: #374151; }
        .empty-row-sub { font-size: 13px; color: #9ca3af; margin-top: 4px; }

        @media (max-width: 900px) {
          .stats-row { grid-template-columns: 1fr 1fr; }
          .farmer-main { padding: 0 20px; }
          .form-grid, .form-grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="farmer-page">
        {/* Header */}
        <div className="farmer-header">
          <div className="farmer-header-inner">
            <div>
              <div className="farmer-welcome">Farmer Dashboard</div>
              <h1 className="farmer-header-title">Welcome back, {username} </h1>
              <p className="farmer-header-sub">Manage your produce listings and track your market activity</p>
            </div>
            <button className="btn-add" onClick={() => { setShowForm(true); setEditingProduce(null); resetForm(); }}>
              + Register New Produce
            </button>
          </div>
        </div>

        <div className="farmer-main">
          {/* Stats */}
          <div className="stats-row">
            {[
              { icon: '📦', iconBg: '#f0fdf4', label: 'Total Listings', val: produces.length, sub: 'All produce items' },
              { icon: '✅', iconBg: '#f0fdf4', label: 'Available', val: available, sub: 'Ready to sell', green: true },
              { icon: '🤝', iconBg: '#eff6ff', label: 'Sold', val: produces.filter(p => p.status === 'sold').length, sub: 'Completed' },
              {
                icon: '💰', iconBg: '#fefce8', label: 'Total Value',
                val: `UGX ${(totalValue / 1000000).toFixed(1)}M`,
                sub: 'Inventory value', isStr: true
              },
            ].map(s => (
              <div key={s.label} className="stat-box">
                <div className="stat-box-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                <div className="stat-box-label">{s.label}</div>
                <div className={`stat-box-val${s.green ? ' green' : ''}`} style={s.isStr ? { fontSize: '20px' } : {}}>{s.val}</div>
                <div className="stat-box-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* <div><WeatherWidget />
  </div> */}

          

          {/* Toasts */}
          {success && <div className="toast success">✓ {success}</div>}
          {error && <div className="toast error">⚠️ {error}</div>}

          {/* Form */}
          {showForm && (
            <div className="form-card">
              <div className="form-card-header">
                <span className="form-card-title">
                  {editingProduce ? 'Edit Produce' : 'Register New Produce'}
                </span>
                <button className="btn-cancel" onClick={() => { setShowForm(false); setEditingProduce(null); resetForm(); }}>
                  Cancel
                </button>
              </div>
              <div className="form-card-body">
                <form onSubmit={handleSubmit}>
                  <div className="section-divider-label">Basic Information</div>
                  <div className="form-grid">
                    <div className="form-field form-full">
                      <label className="form-lbl">Produce Name <span className="form-req">*</span></label>
                      <input type="text" className="form-inp" placeholder="e.g. Fresh Tomatoes" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label className="form-lbl">Category <span className="form-req">*</span></label>
                      <select className="form-inp" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-lbl">Status</label>
                      <select className="form-inp" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-lbl">Quantity <span className="form-req">*</span></label>
                      <input type="number" className="form-inp" placeholder="Enter amount" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label className="form-lbl">Unit</label>
                      <input type="text" className="form-inp" placeholder="kg, bags, boxes..." value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label className="form-lbl">Price per Unit (UGX) <span className="form-req">*</span></label>
                      <input type="number" className="form-inp" placeholder="e.g. 2500" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div className="form-field form-full">
                      <label className="form-lbl">Description</label>
                      <textarea className="form-inp" placeholder="Describe quality, harvest date, packaging..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                  </div>

                  <div className="section-divider-label">Location</div>
                  <div className="form-grid-3">
                    <div className="form-field">
                      <label className="form-lbl">District <span className="form-req">*</span></label>
                      <input type="text" className="form-inp" placeholder="e.g. Lira" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label className="form-lbl">Sub County</label>
                      <input type="text" className="form-inp" placeholder="Sub county" value={formData.sub_county} onChange={e => setFormData({ ...formData, sub_county: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label className="form-lbl">Village</label>
                      <input type="text" className="form-inp" placeholder="Village name" value={formData.village} onChange={e => setFormData({ ...formData, village: e.target.value })} />
                    </div>
                  </div>

                  <div className="section-divider-label">Produce Photos</div>
                  <div className="img-upload-area">
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                    <div className="img-upload-icon">📸</div>
                    <div className="img-upload-label">Click or drag photos here</div>
                    <div className="img-upload-sub">PNG, JPG up to 5MB each</div>
                  </div>

                  {(imagePreviewUrls.length > 0 || existingImages.length > 0) && (
                    <div className="img-grid">
                      {existingImages.map((url, i) => (
                        <div key={`ex-${i}`} className="img-thumb">
                          <img src={url} alt="existing" />
                          <button type="button" className="img-remove" onClick={() => removeExistingImage(i, url)}>×</button>
                        </div>
                      ))}
                      {imagePreviewUrls.map((url, i) => (
                        <div key={`new-${i}`} className="img-thumb">
                          <img src={url} alt="preview" />
                          <button type="button" className="img-remove" onClick={() => removeNewImage(i)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="form-actions" style={{ marginTop: '24px' }}>
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? <><span className="spinner" />Processing...</> : editingProduce ? 'Update Produce' : 'Register Produce'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="table-card">
            <div className="table-card-header">
              <span className="table-card-title">My Produces</span>
              <span className="table-count">{produces.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Produce</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageLoading ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading...</td></tr>
                  ) : produces.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan={7}>
                        <span className="empty-row-icon">🌱</span>
                        <div className="empty-row-title">No produces registered yet</div>
                        <div className="empty-row-sub">Click "Register New Produce" to add your first listing</div>
                      </td>
                    </tr>
                  ) : (
                    produces.map(p => {
                      const sc = statusStyle(p.status);
                      return (
                        <tr key={p.id}>
                          <td>
                            {p.image
                              ? <img src={getMediaUrl(p.image)} alt={p.name} className="table-img" />
                              : <div className="table-img-placeholder">🌾:</div>
                            }
                          </td>
                          <td>
                            <div className="produce-name-cell">{p.name}</div>
                            <span className="cat-tag">{p.category}</span>
                          </td>
                          <td className="price-cell">UGX {Number(p.price).toLocaleString()}</td>
                          <td>{p.quantity} {p.unit}</td>
                          <td>{p.district || '—'}</td>
                          <td>
                            <span className="status-chip" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-cell">
                              <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                              <button className="btn-del" onClick={() => handleDelete(p.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div><PricePrediction /></div>
          </div>
        </div>
         {/* Chat Section
      <div style={{ marginTop: '40px' }}>
        <h2>💬 Chat with Buyer</h2>
        <InAppChat 
          currentUser="farmer"
          partnerName="Amina Traders"
          partnerRole="Buyer"
          productName="Fresh Tomatoes - 50kg"
        />
      </div> */}
      </div>
    </>
  );
};

export default FarmerDashboard;

