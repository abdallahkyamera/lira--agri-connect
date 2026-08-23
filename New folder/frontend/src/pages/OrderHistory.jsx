// src/pages/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching orders from API
    setTimeout(() => {
      setOrders([
        { id: 1, produce: "Maize", quantity: 50, total: 125000, status: "Completed", date: "2025-05-15" },
        { id: 2, produce: "Beans", quantity: 30, total: 84000, status: "Pending", date: "2025-05-16" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#166534', marginBottom: '30px' }}>Order History</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#166534', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Produce</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Quantity</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Total (UGX)</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{order.date}</td>
                    <td style={{ padding: '12px' }}>{order.produce}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{order.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{order.total.toLocaleString()}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '6px 16px', 
                        borderRadius: '20px',
                        background: order.status === 'Completed' ? '#d1fae5' : '#fef3c7',
                        color: order.status === 'Completed' ? '#166534' : '#d97706'
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;