"use client";

import { useEffect, useMemo, useState } from "react";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");

  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("FETCH_ORDERS_ERROR:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    try {
      setUpdatingId(orderId);

      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update order status.");
        return;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("UPDATE_ORDER_STATUS_ERROR:", error);
      alert("Something went wrong while updating status.");
    } finally {
      setUpdatingId("");
    }
  }

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

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return orders;

    return orders.filter((order) => {
      return (
        order.customerName?.toLowerCase().includes(query) ||
        order.productName?.toLowerCase().includes(query) ||
        order.status?.toLowerCase().includes(query)
      );
    });
  }, [orders, search]);

  return (
    <div className="page-container">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Orders Management</h1>
          <p className="page-subtitle">Review and update customer orders</p>
        </div>
      </div>

      <div className="page-search-wrap">
        <input
          type="text"
          className="page-search-input"
          placeholder="Search by customer, product, or status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="user-table-wrap">
        <table className="user-table">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Loading orders...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8">No matching orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.customerName}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>
                    <span className={getStatusClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updatingId === order._id}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}