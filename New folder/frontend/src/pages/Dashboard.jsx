// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';
import FarmerDashboard from '../components/Dashboard/FarmerDashboard';
import BuyerDashboard from '../components/Dashboard/BuyerDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      {user.role === 'farmer' && <FarmerDashboard />}
      {user.role === 'buyer' && <BuyerDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
      
    </div>
  );
};

export default Dashboard;