
import React, { useEffect, useMemo, useState } from 'react';
import {
  getProduces,
  createProduce,
  deleteProduce
} from '../../services/api';
import PricePrediction from '../AI/PricePrediction';
import Footer from '../Layout/Footer';
import api from '../../services/api';

const AdminDashboard = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [activeSection, setActiveSection] = useState('dashboard');

  const [produces, setProduces] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingProduce, setEditingProduce] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    description: '',
    status: 'available'
  });

  // =========================================================
  // FETCH PRODUCE
  // =========================================================

  useEffect(() => {
    fetchProduces();
  }, []);

  const fetchProduces = async () => {
    try {
      setLoading(true);

      const res = await getProduces();

      setProduces(
        Array.isArray(res.data)
          ? res.data
          : res.data?.results || []
      );
    } catch (error) {
      console.error('Failed to fetch produces:', error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH USERS
  // =========================================================

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);

      const res = await api.get('/admin/users/');

      setUsers(
        Array.isArray(res.data)
          ? res.data
          : res.data?.results || []
      );
    } catch (error) {
      console.error('Failed to fetch users:', error);

      /*
       * If your backend doesn't have /admin/users/ yet,
       * this section will fail until the endpoint is created.
       */
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch users when admin/user section is opened
  useEffect(() => {
    if (
      activeSection === 'admins' ||
      activeSection === 'farmers' ||
      activeSection === 'buyers' ||
      activeSection === 'analytics' ||
      activeSection === 'dashboard'
    ) {
      fetchUsers();
    }
  }, [activeSection]);

  // =========================================================
  // PRODUCE FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      unit: 'kg',
      price: '',
      description: '',
      status: 'available'
    });

    setEditingProduce(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduce) {
        alert('Update functionality coming soon.');
      } else {
        await createProduce(formData);
        alert('Produce added successfully!');
      }

      resetForm();
      fetchProduces();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
        'Operation failed'
      );
    }
  };

  const handleEdit = (produce) => {
    setEditingProduce(produce);

    setFormData({
      name: produce.name || '',
      quantity: produce.quantity || '',
      unit: produce.unit || 'kg',
      price: produce.price || '',
      description: produce.description || '',
      status: produce.status || 'available'
    });

    setShowForm(true);

    setActiveSection('produces');
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this produce?'
      )
    ) {
      return;
    }

    try {
      await api.delete(`/produces/${id}/`);

      alert('Produce deleted successfully.');

      fetchProduces();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
        'Delete failed'
      );
    }
  };

  // =========================================================
  // ADMIN MANAGEMENT
  // =========================================================

  const changeUserRole = async (userId, role) => {
    const action =
      role === 'admin'
        ? 'give this user admin access'
        : 'remove admin access from this user';

    if (!window.confirm(`Are you sure you want to ${action}?`)) {
      return;
    }

    try {
      await api.patch(
        `/admin/users/${userId}/role/`,
        {
          role
        }
      );

      alert(
        role === 'admin'
          ? 'User has been promoted to admin.'
          : 'Admin access has been removed.'
      );

      fetchUsers();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
        'Unable to change user role.'
      );
    }
  };

  // =========================================================
  // ANALYTICS
  // =========================================================

  const farmerCount = useMemo(() => {
    return users.filter(
      user =>
        String(user.role).toLowerCase() === 'farmer'
    ).length;
  }, [users]);

  const buyerCount = useMemo(() => {
    return users.filter(
      user =>
        String(user.role).toLowerCase() === 'buyer'
    ).length;
  }, [users]);

  const adminCount = useMemo(() => {
    return users.filter(
      user =>
        String(user.role).toLowerCase() === 'admin'
    ).length;
  }, [users]);

  const totalUsers = users.length;

  const availableCount = produces.filter(
    p => p.status === 'available'
  ).length;

  const soldCount = produces.filter(
    p => p.status === 'sold'
  ).length;

  const unavailableCount = produces.filter(
    p => p.status === 'unavailable'
  ).length;

  const totalQuantity = produces.reduce(
    (sum, p) =>
      sum + Number(p.quantity || 0),
    0
  );

  const totalMarketValue = produces.reduce(
    (sum, p) =>
      sum +
      Number(p.price || 0) *
      Number(p.quantity || 0),
    0
  );

  const averagePrice = produces.length
    ? produces.reduce(
        (sum, p) =>
          sum + Number(p.price || 0),
        0
      ) / produces.length
    : 0;

  // =========================================================
  // FILTER PRODUCE
  // =========================================================

  const filteredProduces = produces.filter(p => {
    const name =
      p.name?.toLowerCase() || '';

    const farmer =
      p.farmer?.username?.toLowerCase() || '';

    const search =
      searchTerm.toLowerCase();

    const matchesSearch =
      name.includes(search) ||
      farmer.includes(search);

    const matchesStatus =
      filterStatus === 'all' ||
      p.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // =========================================================
  // FILTER USERS
  // =========================================================

  const filteredUsers = users.filter(user => {
    const search =
      userSearch.toLowerCase();

    const username =
      user.username?.toLowerCase() || '';

    const email =
      user.email?.toLowerCase() || '';

    const role =
      user.role?.toLowerCase() || '';

    const matchesSearch =
      username.includes(search) ||
      email.includes(search);

    const matchesRole =
      userFilter === 'all' ||
      role === userFilter;

    return matchesSearch && matchesRole;
  });

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigation = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈'
    },
    {
      id: 'farmers',
      label: 'Farmers',
      icon: '👨‍🌾'
    },
    {
      id: 'buyers',
      label: 'Buyers',
      icon: '🛒'
    },
    {
      id: 'produces',
      label: 'Produce',
      icon: '🌾'
    },
    {
      id: 'admins',
      label: 'Admin Access',
      icon: '🛡️'
    },
    {
      id: 'predictions',
      label: 'Price Prediction',
      icon: '🤖'
    }
  ];

  const navigate = section => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // =========================================================
  // FORMAT MONEY
  // =========================================================

  const formatMoney = value => {
    return `UGX ${Number(value || 0).toLocaleString()}`;
  };

  // =========================================================
  // STATUS COLORS
  // =========================================================

  const statusColor = status => {
    const colors = {
      available: {
        background: '#ecfdf5',
        color: '#047857'
      },

      sold: {
        background: '#eff6ff',
        color: '#2563eb'
      },

      unavailable: {
        background: '#fef2f2',
        color: '#dc2626'
      }
    };

    return (
      colors[status] || {
        background: '#f3f4f6',
        color: '#6b7280'
      }
    );
  };

  // =========================================================
  // RENDER DASHBOARD
  // =========================================================

  const renderDashboard = () => {
    return (
      <>
        <div className="page-title">
          <div>
            <h1>Dashboard Overview</h1>
            <p>
              Monitor the Lira Agri-Connect marketplace.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              setShowForm(true);
              setEditingProduce(null);
              setActiveSection('produces');
            }}
          >
            + Add Produce
          </button>
        </div>

        {/* Main statistics */}

        <div className="stats-grid">

          <StatCard
            icon="👥"
            title="Total Users"
            value={totalUsers}
            subtitle="Farmers, buyers and admins"
          />

          <StatCard
            icon="👨‍🌾"
            title="Farmers"
            value={farmerCount}
            subtitle="Registered farmers"
          />

          <StatCard
            icon="🛒"
            title="Buyers"
            value={buyerCount}
            subtitle="Registered buyers"
          />

          <StatCard
            icon="🌾"
            title="Produce Listings"
            value={produces.length}
            subtitle="Total marketplace listings"
          />

          <StatCard
            icon="✅"
            title="Available"
            value={availableCount}
            subtitle="Currently available"
          />

          <StatCard
            icon="🤝"
            title="Sold"
            value={soldCount}
            subtitle="Completed listings"
          />

          <StatCard
            icon="💰"
            title="Market Value"
            value={
              totalMarketValue >= 1000000
                ? `UGX ${(totalMarketValue / 1000000).toFixed(1)}M`
                : formatMoney(totalMarketValue)
            }
            subtitle="Total inventory value"
          />

          <StatCard
            icon="🛡️"
            title="Administrators"
            value={adminCount}
            subtitle="Users with admin access"
          />

        </div>

        {/* User analytics */}

        <div className="two-column">

          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>User Overview</h2>
                <p>Platform user distribution</p>
              </div>
            </div>

            <div className="user-bars">

              <AnalyticsBar
                label="Farmers"
                value={farmerCount}
                total={totalUsers}
              />

              <AnalyticsBar
                label="Buyers"
                value={buyerCount}
                total={totalUsers}
              />

              <AnalyticsBar
                label="Admins"
                value={adminCount}
                total={totalUsers}
              />

            </div>
          </div>

          <div className="panel">

            <div className="panel-header">
              <div>
                <h2>Marketplace Overview</h2>
                <p>Current produce activity</p>
              </div>
            </div>

            <div className="market-summary">

              <div>
                <span>Total Quantity</span>
                <strong>
                  {totalQuantity.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Average Price</span>
                <strong>
                  {formatMoney(averagePrice)}
                </strong>
              </div>

              <div>
                <span>Unavailable</span>
                <strong>
                  {unavailableCount}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* Recent produce */}

        <div className="panel">

          <div className="panel-header">
            <div>
              <h2>Recent Produce Listings</h2>
              <p>
                Latest produce available on the platform.
              </p>
            </div>

            <button
              className="outline-btn"
              onClick={() =>
                navigate('produces')
              }
            >
              View All
            </button>
          </div>

          <ProduceTable
            produces={produces.slice(0, 6)}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>
      </>
    );
  };

  // =========================================================
  // ANALYTICS PAGE
  // =========================================================

  const renderAnalytics = () => {
    return (
      <>
        <div className="page-title">
          <div>
            <h1>Platform Analytics</h1>
            <p>
              Insights from farmers, buyers and marketplace activity.
            </p>
          </div>
        </div>

        <div className="stats-grid">

          <StatCard
            icon="👨‍🌾"
            title="Farmers"
            value={farmerCount}
            subtitle="Registered farmers"
          />

          <StatCard
            icon="🛒"
            title="Buyers"
            value={buyerCount}
            subtitle="Registered buyers"
          />

          <StatCard
            icon="🌾"
            title="Listings"
            value={produces.length}
            subtitle="Total listings"
          />

          <StatCard
            icon="💰"
            title="Market Value"
            value={formatMoney(totalMarketValue)}
            subtitle="Current inventory"
          />

        </div>

        <div className="two-column">

          <div className="panel">

            <div className="panel-header">
              <div>
                <h2>User Distribution</h2>
                <p>Users by account type</p>
              </div>
            </div>

            <AnalyticsBar
              label="Farmers"
              value={farmerCount}
              total={totalUsers}
            />

            <AnalyticsBar
              label="Buyers"
              value={buyerCount}
              total={totalUsers}
            />

            <AnalyticsBar
              label="Administrators"
              value={adminCount}
              total={totalUsers}
            />

          </div>

          <div className="panel">

            <div className="panel-header">
              <div>
                <h2>Produce Status</h2>
                <p>Marketplace listing status</p>
              </div>
            </div>

            <AnalyticsBar
              label="Available"
              value={availableCount}
              total={produces.length}
            />

            <AnalyticsBar
              label="Sold"
              value={soldCount}
              total={produces.length}
            />

            <AnalyticsBar
              label="Unavailable"
              value={unavailableCount}
              total={produces.length}
            />

          </div>

        </div>

        <div className="panel">

          <div className="panel-header">
            <div>
              <h2>Marketplace Statistics</h2>
              <p>Summary of produce activity.</p>
            </div>
          </div>

          <div className="analytics-grid">

            <AnalyticsNumber
              title="Total Produce"
              value={produces.length}
            />

            <AnalyticsNumber
              title="Total Quantity"
              value={totalQuantity.toLocaleString()}
            />

            <AnalyticsNumber
              title="Average Price"
              value={formatMoney(averagePrice)}
            />

            <AnalyticsNumber
              title="Market Value"
              value={formatMoney(totalMarketValue)}
            />

          </div>

        </div>
      </>
    );
  };

  // =========================================================
  // PRODUCE PAGE
  // =========================================================

  const renderProduces = () => {
    return (
      <>
        <div className="page-title">

          <div>
            <h1>Produce Management</h1>
            <p>
              Manage agricultural products listed by farmers.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              setEditingProduce(null);
              setShowForm(true);
            }}
          >
            + Add Produce
          </button>

        </div>

        {showForm && (
          <div className="panel form-panel">

            <div className="panel-header">

              <div>
                <h2>
                  {editingProduce
                    ? 'Edit Produce'
                    : 'Add New Produce'}
                </h2>
              </div>

              <button
                className="outline-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <FormInput
                  label="Produce Name"
                  value={formData.name}
                  onChange={value =>
                    setFormData({
                      ...formData,
                      name: value
                    })
                  }
                  required
                />

                <FormInput
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={value =>
                    setFormData({
                      ...formData,
                      quantity: value
                    })
                  }
                  required
                />

                <FormInput
                  label="Unit"
                  value={formData.unit}
                  onChange={value =>
                    setFormData({
                      ...formData,
                      unit: value
                    })
                  }
                />

                <FormInput
                  label="Price per Unit (UGX)"
                  type="number"
                  value={formData.price}
                  onChange={value =>
                    setFormData({
                      ...formData,
                      price: value
                    })
                  }
                  required
                />

                <div className="form-group">

                  <label>Status</label>

                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        status: e.target.value
                      })
                    }
                  >
                    <option value="available">
                      Available
                    </option>

                    <option value="sold">
                      Sold
                    </option>

                    <option value="unavailable">
                      Unavailable
                    </option>

                  </select>

                </div>

                <div className="form-group full">

                  <label>Description</label>

                  <textarea
                    value={formData.description}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        description: e.target.value
                      })
                    }
                    placeholder="Describe the produce..."
                  />

                </div>

              </div>

              <button
                type="submit"
                className="primary-btn"
              >
                {editingProduce
                  ? 'Update Produce'
                  : 'Create Produce'}
              </button>

            </form>

          </div>
        )}

        <div className="panel">

          <div className="toolbar">

            <input
              placeholder="🔍 Search produce or farmer..."
              value={searchTerm}
              onChange={e =>
                setSearchTerm(e.target.value)
              }
            />

            <select
              value={filterStatus}
              onChange={e =>
                setFilterStatus(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="available">
                Available
              </option>

              <option value="sold">
                Sold
              </option>

              <option value="unavailable">
                Unavailable
              </option>
            </select>

          </div>

          <ProduceTable
            produces={filteredProduces}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>
      </>
    );
  };

  // =========================================================
  // USER MANAGEMENT
  // =========================================================

  const renderUsers = role => {

    const title =
      role === 'farmer'
        ? 'Farmers'
        : 'Buyers';

    const description =
      role === 'farmer'
        ? 'Manage farmers registered on the platform.'
        : 'Manage buyers registered on the platform.';

    const roleUsers =
      users.filter(
        user =>
          String(user.role).toLowerCase() === role
      );

    return (
      <>
        <div className="page-title">

          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="page-count">
            {roleUsers.length} users
          </div>

        </div>

        <div className="panel">

          <div className="toolbar">

            <input
              placeholder={`🔍 Search ${role}s...`}
              value={userSearch}
              onChange={e =>
                setUserSearch(e.target.value)
              }
            />

          </div>

          <UserTable
            users={roleUsers.filter(user => {

              const search =
                userSearch.toLowerCase();

              return (
                user.username
                  ?.toLowerCase()
                  .includes(search) ||
                user.email
                  ?.toLowerCase()
                  .includes(search)
              );
            })}
            loading={usersLoading}
            onPromote={user =>
              changeUserRole(
                user.id,
                'admin'
              )
            }
          />

        </div>
      </>
    );
  };

  // =========================================================
  // ADMIN MANAGEMENT PAGE
  // =========================================================

  const renderAdminManagement = () => {

    return (
      <>
        <div className="page-title">

          <div>
            <h1>Admin Access</h1>

            <p>
              Control which users have administrator privileges.
            </p>
          </div>

        </div>

        <div className="warning-box">
          <strong>Administrator permissions</strong>

          <p>
            Only trusted users should be given administrator
            access. Administrators can manage users, produce
            listings and marketplace operations.
          </p>
        </div>

        <div className="panel">

          <div className="toolbar">

            <input
              placeholder="🔍 Search users..."
              value={userSearch}
              onChange={e =>
                setUserSearch(e.target.value)
              }
            />

            <select
              value={userFilter}
              onChange={e =>
                setUserFilter(e.target.value)
              }
            >

              <option value="all">
                All Users
              </option>

              <option value="farmer">
                Farmers
              </option>

              <option value="buyer">
                Buyers
              </option>

              <option value="admin">
                Administrators
              </option>

            </select>

          </div>

          <UserTable
            users={filteredUsers}
            loading={usersLoading}
            adminManagement
            onPromote={user =>
              changeUserRole(
                user.id,
                'admin'
              )
            }
            onRemoveAdmin={user =>
              changeUserRole(
                user.id,
                user.role === 'admin'
                  ? 'buyer'
                  : user.role
              )
            }
          />

        </div>
      </>
    );
  };

  // =========================================================
  // MAIN RENDER
  // =========================================================

  return (
    <div className="admin-layout">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? 'open' : ''
        }`}
      >

        <div className="sidebar-brand">

          <div className="brand-logo">
            🌾
          </div>

          <div>
            <strong>
              Lira Agri-Connect
            </strong>

            <span>
              Administration
            </span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <div className="nav-section">
            MAIN
          </div>

          {navigation.map(item => (
            <button
              key={item.id}
              className={
                activeSection === item.id
                  ? 'nav-item active'
                  : 'nav-item'
              }
              onClick={() =>
                navigate(item.id)
              }
            >

              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </button>
          ))}

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-profile">

            <div className="profile-avatar">
              A
            </div>

            <div>

              <strong>
                Administrator
              </strong>

              <span>
                Platform Admin
              </span>

            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="admin-content">

        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            ☰
          </button>

          <div>

            <span className="breadcrumb">
              Admin /{' '}
              {navigation.find(
                n =>
                  n.id === activeSection
              )?.label || 'Dashboard'}
            </span>

          </div>

          <div className="topbar-right">

            <div className="status-indicator">
              <span />
              System Online
            </div>

          </div>

        </header>

        <div className="content-wrapper">

          {activeSection === 'dashboard' &&
            renderDashboard()}

          {activeSection === 'analytics' &&
            renderAnalytics()}

          {activeSection === 'produces' &&
            renderProduces()}

          {activeSection === 'farmers' &&
            renderUsers('farmer')}

          {activeSection === 'buyers' &&
            renderUsers('buyer')}

          {activeSection === 'admins' &&
            renderAdminManagement()}

          {activeSection === 'predictions' && (
            <>
              <div className="page-title">

                <div>
                  <h1>
                    AI Price Prediction
                  </h1>

                  <p>
                    Agricultural market price insights.
                  </p>
                </div>

              </div>

              <div className="panel">
                <PricePrediction />
              </div>
            </>
          )}

        </div>

        <Footer />

      </main>

      {/* STYLES */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .admin-layout {
          min-height: 100vh;
          background: #f5f7f5;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #17231a;
        }

        /* SIDEBAR */

        .admin-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 250px;
          background: #0d2f1b;
          color: white;
          z-index: 100;
          display: flex;
          flex-direction: column;
        }

        .sidebar-brand {
          height: 78px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
          border-bottom:
            1px solid rgba(255,255,255,0.08);
        }

        .brand-logo {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #1c6b3a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
        }

        .sidebar-brand strong {
          display: block;
          font-size: 14px;
        }

        .sidebar-brand span {
          display: block;
          margin-top: 3px;
          font-size: 11px;
          color: #9db5a4;
        }

        .sidebar-nav {
          flex: 1;
          padding: 25px 12px;
        }

        .nav-section {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: #668270;
          padding: 0 12px 10px;
        }

        .nav-item {
          width: 100%;
          border: none;
          background: transparent;
          color: #b7c8bd;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 9px;
          margin-bottom: 5px;
          cursor: pointer;
          font-size: 13px;
          text-align: left;
          transition: 0.2s;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.06);
          color: white;
        }

        .nav-item.active {
          background: #1c6b3a;
          color: white;
        }

        .nav-icon {
          width: 24px;
          text-align: center;
          font-size: 17px;
        }

        .sidebar-bottom {
          padding: 16px;
          border-top:
            1px solid rgba(255,255,255,0.08);
        }

        .admin-profile {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #3a8f59;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .admin-profile strong {
          display: block;
          font-size: 12px;
        }

        .admin-profile span {
          display: block;
          color: #7e9b89;
          font-size: 10px;
          margin-top: 3px;
        }

        /* MAIN */

        .admin-content {
          margin-left: 250px;
          min-height: 100vh;
        }

        .topbar {
          height: 70px;
          background: white;
          border-bottom: 1px solid #e8ece9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 35px;
        }

        .breadcrumb {
          color: #7b897e;
          font-size: 13px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: #4d6253;
        }

        .status-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
        }

        .mobile-menu {
          display: none;
          border: none;
          background: transparent;
          font-size: 24px;
          cursor: pointer;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
        }

        /* TITLES */

        .page-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .page-title h1 {
          margin: 0;
          color: #102b19;
          font-size: 27px;
        }

        .page-title p {
          margin: 7px 0 0;
          color: #7d8b81;
          font-size: 13px;
        }

        /* BUTTONS */

        .primary-btn {
          border: none;
          border-radius: 8px;
          background: #176b38;
          color: white;
          padding: 11px 17px;
          font-weight: 600;
          cursor: pointer;
        }

        .primary-btn:hover {
          background: #12582e;
        }

        .outline-btn {
          border: 1px solid #dce4de;
          background: white;
          color: #30523b;
          padding: 9px 14px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 500;
        }

        /* STATS */

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e9eeea;
          border-radius: 12px;
          padding: 20px;
          box-shadow:
            0 2px 8px rgba(0,0,0,0.025);
        }

        .stat-card-icon {
          font-size: 23px;
          margin-bottom: 15px;
        }

        .stat-card-title {
          color: #829087;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .7px;
          font-weight: 600;
        }

        .stat-card-value {
          color: #15361f;
          font-size: 25px;
          font-weight: 700;
          margin-top: 7px;
        }

        .stat-card-subtitle {
          color: #9aa59e;
          font-size: 11px;
          margin-top: 5px;
        }

        /* PANELS */

        .panel {
          background: white;
          border: 1px solid #e8ede9;
          border-radius: 12px;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .panel-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #edf1ee;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 16px;
          color: #173a21;
        }

        .panel-header p {
          margin: 5px 0 0;
          font-size: 12px;
          color: #8a958e;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* ANALYTICS */

        .user-bars {
          padding: 20px;
        }

        .analytics-bar {
          margin-bottom: 20px;
        }

        .analytics-bar:last-child {
          margin-bottom: 0;
        }

        .bar-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
          font-size: 12px;
        }

        .bar-info span:first-child {
          color: #536258;
        }

        .bar-info span:last-child {
          font-weight: bold;
          color: #193b24;
        }

        .bar {
          height: 8px;
          background: #edf1ee;
          border-radius: 20px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: #24804a;
          border-radius: 20px;
        }

        .market-summary {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          padding: 20px;
          gap: 15px;
        }

        .market-summary div {
          padding: 15px;
          background: #f7faf8;
          border-radius: 9px;
        }

        .market-summary span {
          display: block;
          color: #87948b;
          font-size: 11px;
        }

        .market-summary strong {
          display: block;
          margin-top: 7px;
          font-size: 18px;
          color: #183a23;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 15px;
          padding: 20px;
        }

        .analytics-number {
          background: #f7faf8;
          padding: 20px;
          border-radius: 9px;
        }

        .analytics-number span {
          display: block;
          color: #7e8c82;
          font-size: 11px;
        }

        .analytics-number strong {
          display: block;
          color: #183a23;
          margin-top: 8px;
          font-size: 19px;
        }

        /* TOOLBAR */

        .toolbar {
          padding: 16px 20px;
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #edf1ee;
        }

        .toolbar input,
        .toolbar select {
          padding: 10px 12px;
          border: 1px solid #dce4de;
          border-radius: 8px;
          outline: none;
          font-size: 13px;
          background: white;
        }

        .toolbar input {
          flex: 1;
        }

        /* TABLE */

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          background: #f8faf8;
          color: #8b978f;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .6px;
          padding: 13px 18px;
        }

        td {
          padding: 14px 18px;
          border-top: 1px solid #f0f3f1;
          color: #38453c;
          font-size: 13px;
        }

        .produce-title {
          font-weight: 600;
          color: #163b21;
        }

        .muted {
          color: #89958d;
        }

        .status {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .action-group {
          display: flex;
          gap: 6px;
        }

        .edit-btn,
        .delete-btn,
        .admin-btn {
          border: none;
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 11px;
        }

        .edit-btn {
          background: #eff6ff;
          color: #2563eb;
        }

        .delete-btn {
          background: #fef2f2;
          color: #dc2626;
        }

        .admin-btn {
          background: #ecfdf5;
          color: #047857;
        }

        /* FORM */

        .form-panel {
          padding-bottom: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 16px;
          padding: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          color: #47554b;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 11px;
          border: 1px solid #dce4de;
          border-radius: 8px;
          outline: none;
          font-size: 13px;
          font-family: inherit;
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-panel form > .primary-btn {
          margin-left: 20px;
        }

        /* WARNING */

        .warning-box {
          background: #fffbeb;
          border: 1px solid #fde68a;
          padding: 17px 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          color: #785b13;
        }

        .warning-box strong {
          font-size: 13px;
        }

        .warning-box p {
          margin: 6px 0 0;
          font-size: 12px;
        }

        .page-count {
          color: #6d7c72;
          font-size: 13px;
        }

        /* EMPTY */

        .empty {
          text-align: center;
          padding: 45px 20px;
          color: #89958d;
          font-size: 13px;
        }

        /* OVERLAY */

        .sidebar-overlay {
          display: none;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {

          .stats-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .two-column {
            grid-template-columns: 1fr;
          }

          .analytics-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 750px) {

          .admin-sidebar {
            transform: translateX(-100%);
            transition: .25s;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .admin-content {
            margin-left: 0;
          }

          .mobile-menu {
            display: block;
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.35);
            z-index: 90;
          }

          .content-wrapper {
            padding: 20px;
          }

          .topbar {
            padding: 0 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full {
            grid-column: auto;
          }

          .page-title {
            align-items: flex-start;
            flex-direction: column;
          }

          .toolbar {
            flex-direction: column;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .market-summary {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </div>
  );
};


// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
  icon,
  title,
  value,
  subtitle
}) => (
  <div className="stat-card">

    <div className="stat-card-icon">
      {icon}
    </div>

    <div className="stat-card-title">
      {title}
    </div>

    <div className="stat-card-value">
      {value}
    </div>

    <div className="stat-card-subtitle">
      {subtitle}
    </div>

  </div>
);


// =========================================================
// ANALYTICS BAR
// =========================================================

const AnalyticsBar = ({
  label,
  value,
  total
}) => {

  const percentage =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0;

  return (
    <div className="analytics-bar">

      <div className="bar-info">

        <span>
          {label}
        </span>

        <span>
          {value} ({percentage}%)
        </span>

      </div>

      <div className="bar">

        <div
          className="bar-fill"
          style={{
            width: `${percentage}%`
          }}
        />

      </div>

    </div>
  );
};


// =========================================================
// ANALYTICS NUMBER
// =========================================================

const AnalyticsNumber = ({
  title,
  value
}) => (
  <div className="analytics-number">

    <span>
      {title}
    </span>

    <strong>
      {value}
    </strong>

  </div>
);


// =========================================================
// FORM INPUT
// =========================================================

const FormInput = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false
}) => (
  <div className="form-group">

    <label>
      {label}
    </label>

    <input
      type={type}
      value={value}
      required={required}
      onChange={e =>
        onChange(e.target.value)
      }
    />

  </div>
);


// =========================================================
// PRODUCE TABLE
// =========================================================

const ProduceTable = ({
  produces,
  loading,
  onEdit,
  onDelete
}) => {

  if (loading) {
    return (
      <div className="empty">
        Loading produce...
      </div>
    );
  }

  if (!produces.length) {
    return (
      <div className="empty">
        No produce listings found.
      </div>
    );
  }

  return (
    <div className="table-wrapper">

      <table>

        <thead>

          <tr>
            <th>Produce</th>
            <th>Farmer</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {produces.map(produce => {

            const status =
              produce.status || 'available';

            const colors = {
              available: {
                background: '#ecfdf5',
                color: '#047857'
              },
              sold: {
                background: '#eff6ff',
                color: '#2563eb'
              },
              unavailable: {
                background: '#fef2f2',
                color: '#dc2626'
              }
            };

            const style =
              colors[status] ||
              colors.available;

            return (
              <tr key={produce.id}>

                <td>
                  <div className="produce-title">
                    {produce.name}
                  </div>
                </td>

                <td className="muted">
                  {produce.farmer?.username ||
                    produce.farmer?.email ||
                    '—'}
                </td>

                <td>
                  UGX{' '}
                  {Number(
                    produce.price || 0
                  ).toLocaleString()}
                </td>

                <td>
                  {produce.quantity}{' '}
                  {produce.unit}
                </td>

                <td>

                  <span
                    className="status"
                    style={{
                      background:
                        style.background,
                      color:
                        style.color
                    }}
                  >
                    {status}
                  </span>

                </td>

                <td>

                  <div className="action-group">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        onEdit(produce)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        onDelete(produce.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
};


// =========================================================
// USER TABLE
// =========================================================

const UserTable = ({
  users,
  loading,
  adminManagement,
  onPromote,
  onRemoveAdmin
}) => {

  if (loading) {
    return (
      <div className="empty">
        Loading users...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="empty">
        No users found.
      </div>
    );
  }

  return (
    <div className="table-wrapper">

      <table>

        <thead>

          <tr>

            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>

            {adminManagement && (
              <th>Action</th>
            )}

          </tr>

        </thead>

        <tbody>

          {users.map(user => {

            const role =
              String(
                user.role || ''
              ).toLowerCase();

            return (
              <tr key={user.id}>

                <td>
                  <div className="produce-title">
                    {user.username ||
                      user.name ||
                      'Unknown'}
                  </div>
                </td>

                <td className="muted">
                  {user.email || '—'}
                </td>

                <td>
                  <span className="status">
                    {role || 'unknown'}
                  </span>
                </td>

                <td>
                  {user.is_active !== false
                    ? 'Active'
                    : 'Inactive'}
                </td>

                {adminManagement && (
                  <td>

                    <div className="action-group">

                      {role !== 'admin' ? (
                        <button
                          className="admin-btn"
                          onClick={() =>
                            onPromote(user)
                          }
                        >
                          Make Admin
                        </button>
                      ) : (
                        <button
                          className="delete-btn"
                          onClick={() =>
                            onRemoveAdmin(user)
                          }
                        >
                          Remove Admin
                        </button>
                      )}

                    </div>

                  </td>
                )}

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
};

export default AdminDashboard;
