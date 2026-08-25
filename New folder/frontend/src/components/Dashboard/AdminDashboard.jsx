
import React, { useState, useEffect } from 'react';
import {
  getProduces,
  createProduce,
  deleteProduce
} from '../../services/api';
import PricePrediction from '../AI/PricePrediction';
// import WeatherWidget from '../Weather/WeatherWidget';
import Footer from '../Layout/Footer';
import { getMediaUrl } from '../utils/mediaUrl';
import api from '../../services/api';




const AdminDashboard = () => {
  const [produces, setProduces] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduce, setEditingProduce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '', quantity: '', unit: 'kg', price: '', description: '', status: 'available'
  });

  useEffect(() => { fetchProduces(); }, []);

  const fetchProduces = async () => {
    try {
      const res = await getProduces();
      setProduces(res.data);
      // console.log(res.data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduce) {
        alert('Update functionality coming soon');
      } else {
        await createProduce(formData);
        alert('Produce added successfully!');
      }
      setShowForm(false);
      setEditingProduce(null);
      setFormData({ name: '', quantity: '', unit: 'kg', price: '', description: '', status: 'available' });
      fetchProduces();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (produce) => {
    setEditingProduce(produce);
    setFormData({
      name: produce.name, quantity: produce.quantity, unit: produce.unit,
      price: produce.price, description: produce.description || '', status: produce.status
    });
    setShowForm(true);
  };


  const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this produce?')) {
    try {
      await api.delete(`/produces/${id}/`);
      alert('Deleted successfully');
      fetchProduces();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Delete failed');
    }
  }
};
      
   
  // console.log(produces)
  const filtered = produces.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmer?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalValue = produces.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity)), 0);
  const available = produces.filter(p => p.status === 'available').length;
  const sold = produces.filter(p => p.status === 'sold').length;

  const statusColor = (s) => ({
    available: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    sold: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    unavailable: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  }[s] || { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .admin-page {
          min-height: 100vh;
          background: #f4f6f4;
          font-family: 'DM Sans', sans-serif;
        }

        .admin-header {
          background: linear-gradient(135deg, #0f3620 0%, #1a5c34 60%, #0d4a24 100%);
          padding: 40px 40px 60px;
          position: relative;
          overflow: hidden;
        }
        .admin-header::after {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .admin-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        .admin-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }
        .admin-header-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
        }

        .admin-main {
          max-width: 1280px;
          margin: -36px auto 60px;
          padding: 0 40px;
          position: relative;
          z-index: 10;
        }

        /* Stat Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
        }
        .stat-card-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 8px;
        }
        .stat-card-value {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #0f361c;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-card-value.green { color: #16a34a; }
        .stat-card-sub { font-size: 12px; color: #9ca3af; }
        .stat-card-icon {
          float: right;
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          margin-top: -4px;
        }

        /* Content Card */
        .content-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .content-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .content-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f361c;
        }

        /* Add Button */
        .btn-primary {
          padding: 10px 22px;
          background: linear-gradient(135deg, #166534, #15803d);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22,101,52,0.3);
        }

        /* Form */
        .form-section {
          padding: 28px;
          border-bottom: 1px solid #f3f4f6;
          background: #fafafa;
        }
        .form-section-title {
          font-size: 15px;
          font-weight: 600;
          color: #0f361c;
          margin-bottom: 20px;
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-full { grid-column: 1 / -1; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 13px; font-weight: 500; color: #374151; }
        .form-inp {
          padding: 11px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          color: #1f2937;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .form-inp:focus { border-color: #16a34a; }
        textarea.form-inp { resize: vertical; min-height: 90px; }

        /* Filter Bar */
        .filter-bar {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          border-bottom: 1px solid #f3f4f6;
        }
        .filter-search {
          flex: 1;
          min-width: 200px;
          padding: 9px 14px;
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
          padding: 9px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
          background: #fafafa;
          cursor: pointer;
          color: #374151;
        }
        .filter-count {
          font-size: 13px;
          color: #9ca3af;
          margin-left: auto;
        }

        /* Table */
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
          color: #1f2937;
          border-bottom: 1px solid #f9fafb;
        }
        tbody tr:hover { background: #fafafa; }
        tbody tr:last-child td { border-bottom: none; }
        .produce-name {
          font-weight: 600;
          color: #0f361c;
        }
        .farmer-name {
          color: #6b7280;
          font-size: 13px;
        }
        .price-val {
          font-weight: 600;
          color: #16a34a;
          font-family: 'DM Sans', sans-serif;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid;
          text-transform: capitalize;
        }
        .action-btns { display: flex; gap: 8px; }
        .btn-edit {
          padding: 6px 14px;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-edit:hover { background: #dbeafe; }
        .btn-delete {
          padding: 6px 14px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-delete:hover { background: #fee2e2; }
        .btn-secondary {
          padding: 8px 18px;
          background: #fff;
          color: #374151;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: #9ca3af; }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 6px; }
        .empty-sub { font-size: 14px; color: #9ca3af; }

        .loading-row td { text-align: center; padding: 40px; color: #9ca3af; }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .admin-main { padding: 0 20px; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="admin-page">
        {/* Page Header */}
        <div className="admin-header">
          <div className="admin-header-inner">
            <div>
              <h1 className="admin-header-title">Admin Management Panel</h1>
              <p className="admin-header-sub">Manage produces, farmers, and platform operations</p>
            </div>
            <button className="btn-primary" onClick={() => { setShowForm(true); setEditingProduce(null); }}>
              + Add New Produce
            </button>
          </div>
        </div>

        <div className="admin-main">
          {/* Stats */}
          <div className="stats-grid">
            {[
              { label: 'Total Listings', value: produces.length, sub: 'All produce items', icon: '📦', bg: '#f0fdf4', iconColor: '#16a34a' },
              { label: 'Available', value: available, sub: 'Ready to sell', icon: '✅', bg: '#f0fdf4', iconColor: '#16a34a' },
              { label: 'Sold', value: sold, sub: 'Completed deals', icon: '🤝', bg: '#eff6ff', iconColor: '#2563eb' },
              { label: 'Market Value', value: `UGX ${(totalValue / 1000000).toFixed(1)}M`, sub: 'Total inventory value', icon: '💰', bg: '#fefce8', iconColor: '#ca8a04', isString: true },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-card-icon" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <div className="stat-card-label">{s.label}</div>
                <div className={`stat-card-value${!s.isString ? ' green' : ''}`} style={s.isString ? { fontSize: '22px' } : {}}>
                  {s.value}
                </div>
                <div className="stat-card-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Form Card */}
          {showForm && (
            <div className="content-card" style={{ marginBottom: '24px' }}>
              <div className="content-card-header">
                <span className="content-card-title">
                  {editingProduce ? 'Edit Produce' : 'Add New Produce'}
                </span>
                <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingProduce(null); }}>
                  Cancel
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="form-grid">
                    <div className="form-field form-full">
                      <label className="form-label">Produce Name *</label>
                      <input type="text" className="form-inp" placeholder="e.g. Fresh Tomatoes" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Quantity *</label>
                      <input type="number" className="form-inp" placeholder="Enter quantity" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Unit</label>
                      <input type="text" className="form-inp" placeholder="kg, bags, boxes..." value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Price (UGX) *</label>
                      <input type="number" className="form-inp" placeholder="Price per unit" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Status</label>
                      <select className="form-inp" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                    <div className="form-field form-full">
                      <label className="form-label">Description</label>
                      <textarea className="form-inp" placeholder="Describe the produce, quality, harvest date..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                    {editingProduce ? 'Update Produce' : 'Create Produce'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table Card */}
          <div className="content-card">
            <div className="content-card-header">
              <span className="content-card-title">All Produces</span>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>{filtered.length} records</span>
            </div>

            <div className="filter-bar">
              <input
                className="filter-search"
                placeholder="🔍  Search by produce or farmer name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Produce</th>
                    <th>Farmer</th>
                    <th>Price / Unit</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="loading-row">
                      <td colSpan={6}>Loading produces...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <div className="empty-icon">🌾</div>
                          <div className="empty-title">No produces found</div>
                          <div className="empty-sub">Try adjusting your search or add a new produce</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(p => {
                      const sc = statusColor(p.status);
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="produce-name">{p.name}</div>
                          </td>
                          <td>
                            <div className="farmer-name">{p.farmer?.username || '—'}</div>
                          </td>
                          <td>
                            <span className="price-val">UGX {Number(p.price).toLocaleString()}</span>
                          </td>
                          <td>{p.quantity} {p.unit}</td>
                          <td>
                            <span
                              className="status-pill"
                              style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                              <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* <WeatherWidget /> */}
          <PricePrediction />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;

