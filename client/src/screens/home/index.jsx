"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/dashboard", { cache: "no-store" }),
        fetch("/api/orders", { cache: "no-store" }),
      ]);

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
      }

      if (ordersData.success) {
        setRecentOrders((ordersData.orders || []).slice(0, 3));
      }
    } catch (error) {
      console.error("FETCH_DASHBOARD_DATA_ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  function getStatusClass(status) {
    switch (status) {
      case "Pending":
        return "status-badge status-pending";
      case "Confirmed":
        return "status-badge status-confirmed";
      case "Shipped":
        return "status-badge status-shipped";
      case "Delivered":
        return "status-badge status-delivered";
      case "Cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge";
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome to your Walkaholic admin panel. Monitor users, products, and
          orders from one place.
        </p>
      </div>

      {loading ? (
        <div className="dashboard-loading">Loading dashboard data...</div>
      ) : (
        <>
          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-card dashboard-stat-users">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-label">Total Users</span>
              </div>
              <h2 className="dashboard-stat-value">{stats.totalUsers}</h2>
              <p className="dashboard-stat-note">
                Registered users in the platform
              </p>
            </div>

            <div className="dashboard-stat-card dashboard-stat-products">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-label">Total Products</span>
              </div>
              <h2 className="dashboard-stat-value">{stats.totalProducts}</h2>
              <p className="dashboard-stat-note">
                Products currently available
              </p>
            </div>

            <div className="dashboard-stat-card dashboard-stat-orders">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-label">Total Orders</span>
              </div>
              <h2 className="dashboard-stat-value">{stats.totalOrders}</h2>
              <p className="dashboard-stat-note">
                Orders placed in the system
              </p>
            </div>
          </div>

          <div className="dashboard-bottom-grid">
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3 className="dashboard-panel-title">Recent Orders</h3>
                <Link href="/orders" className="dashboard-panel-link">
                  View All
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p className="dashboard-empty-text">No recent orders found.</p>
              ) : (
                <div className="dashboard-order-list">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="dashboard-order-item">
                      <div className="dashboard-order-main">
                        <p className="dashboard-order-customer">
                          {order.customerName}
                        </p>
                        <p className="dashboard-order-product">
                          {order.productName}
                        </p>
                      </div>

                      <div className="dashboard-order-side">
                        <span className={getStatusClass(order.status)}>
                          {order.status}
                        </span>
                        <p className="dashboard-order-date">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3 className="dashboard-panel-title">Quick Actions</h3>
              </div>

              <div className="dashboard-actions">
                <Link href="/products/add" className="dashboard-action-card">
                  <h4>Add Product</h4>
                  <p>Create a new shoe product with variants</p>
                </Link>

                <Link href="/users/add" className="dashboard-action-card">
                  <h4>Add User</h4>
                  <p>Create a new admin or customer account</p>
                </Link>

                <Link href="/orders" className="dashboard-action-card">
                  <h4>Manage Orders</h4>
                  <p>Update order status and review activity</p>
                </Link>

                <Link href="/products" className="dashboard-action-card">
                  <h4>View Products</h4>
                  <p>Check stock, variants, and product details</p>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}