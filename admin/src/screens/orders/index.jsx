"use client";

import { useEffect, useMemo, useState } from "react";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const ITEMS_PER_PAGE = 5;

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  async function fetchOrders() {
    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok && data.success) {
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
    const confirmUpdate = window.confirm(
      `Are you sure you want to change this order status to "${newStatus}"?`
    );

    if (!confirmUpdate) return;

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

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to update order status.");
        return;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setSelectedOrder((prevOrder) =>
        prevOrder && prevOrder._id === orderId
          ? { ...prevOrder, status: newStatus }
          : prevOrder
      );

      alert("Order status updated successfully.");
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
    let result = [...orders];

    const query = search.toLowerCase().trim();

    if (query) {
      result = result.filter((order) => {
        return (
          order.customerName?.toLowerCase().includes(query) ||
          order.productName?.toLowerCase().includes(query) ||
          order.status?.toLowerCase().includes(query) ||
          order.color?.toLowerCase().includes(query) ||
          String(order.size || "").toLowerCase().includes(query) ||
          order.sku?.toLowerCase().includes(query) ||
          order.phone?.toLowerCase().includes(query) ||
          order.city?.toLowerCase().includes(query) ||
          order.pincode?.toLowerCase().includes(query) ||
          order.paymentMethod?.toLowerCase().includes(query)
        );
      });
    }

    if (statusFilter !== "All") {
      result = result.filter((order) => order.status === statusFilter);
    }

    return result;
  }, [orders, search, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <div className="page-container">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Orders Management</h1>
          <p className="page-subtitle">Review and update customer orders</p>
        </div>

        <button type="button" className="page-link-btn" onClick={fetchOrders}>
          Refresh
        </button>
      </div>

      <div
        className="page-search-wrap"
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          className="page-search-input"
          placeholder="Search by customer, product, status, phone, city, pincode, or SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-select"
          style={{ maxWidth: "180px" }}
        >
          <option value="All">All Status</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="user-table-wrap">
        <table className="user-table">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Image</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Variant</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Details</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11">Loading orders...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="11">No matching orders found.</td>
              </tr>
            ) : (
              paginatedOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

                  <td>
                    <img
                      src={order.imageUrl || "/placeholder.png"}
                      alt={order.productName || "Product"}
                      style={{
                        width: "54px",
                        height: "54px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  </td>

                  <td>{order.customerName || "-"}</td>
                  <td>{order.productName || "-"}</td>

                  <td>
                    <div>
                      <strong>{order.color || "-"}</strong>
                    </div>
                    <div>Size: {order.size || "-"}</div>
                    <div>SKU: {order.sku || "-"}</div>
                  </td>

                  <td>{order.quantity || 0}</td>
                  <td>₹{order.totalPrice || 0}</td>

                  <td>
                    <span className={getStatusClass(order.status)}>
                      {order.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={order.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updatingId === order._id}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingId === order._id && (
                      <p style={{ fontSize: "12px", marginTop: "6px" }}>
                        Updating...
                      </p>
                    )}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="table-edit-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                  </td>

                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredOrders.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
            Showing {paginatedOrders.length} of {filteredOrders.length} orders
          </p>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              className="table-edit-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              style={{
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Prev
            </button>

            <span style={{ fontSize: "14px", color: "#374151" }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              className="table-edit-btn"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              style={{
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor:
                  currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "18px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Order Details
                </h2>
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  Order ID: {selectedOrder._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  border: "none",
                  background: "#f3f4f6",
                  color: "#111827",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: "20px",
                marginBottom: "22px",
              }}
            >
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={selectedOrder.imageUrl || "/placeholder.png"}
                  alt={selectedOrder.productName || "Product"}
                  style={{
                    width: "110px",
                    height: "110px",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {selectedOrder.productName || "-"}
                </h3>

                <p style={{ margin: "0 0 6px", color: "#374151" }}>
                  <strong>Customer:</strong> {selectedOrder.customerName || "-"}
                </p>

                <p style={{ margin: "0 0 6px", color: "#374151" }}>
                  <strong>Status:</strong>{" "}
                  <span className={getStatusClass(selectedOrder.status)}>
                    {selectedOrder.status || "Pending"}
                  </span>
                </p>

                <p style={{ margin: "0 0 6px", color: "#374151" }}>
                  <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "16px",
              }}
            >
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "16px",
                  background: "#ffffff",
                }}
              >
                <h4 style={{ margin: "0 0 12px", fontSize: "17px" }}>
                  Product Info
                </h4>

                <p>
                  <strong>Color:</strong> {selectedOrder.color || "-"}
                </p>
                <p>
                  <strong>Size:</strong> {selectedOrder.size || "-"}
                </p>
                <p>
                  <strong>SKU:</strong> {selectedOrder.sku || "-"}
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedOrder.quantity || 0}
                </p>
                <p>
                  <strong>Total:</strong> ₹{selectedOrder.totalPrice || 0}
                </p>
              </div>

              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "16px",
                  background: "#ffffff",
                }}
              >
                <h4 style={{ margin: "0 0 12px", fontSize: "17px" }}>
                  Delivery Info
                </h4>

                <p>
                  <strong>Phone:</strong> {selectedOrder.phone || "-"}
                </p>
                <p>
                  <strong>Address:</strong> {selectedOrder.address || "-"}
                </p>
                <p>
                  <strong>City:</strong> {selectedOrder.city || "-"}
                </p>
                <p>
                  <strong>Pincode:</strong> {selectedOrder.pincode || "-"}
                </p>
              </div>

              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "16px",
                  background: "#ffffff",
                }}
              >
                <h4 style={{ margin: "0 0 12px", fontSize: "17px" }}>
                  Payment
                </h4>

                <p>
                  <strong>Method:</strong>{" "}
                  {selectedOrder.paymentMethod || "Cash on Delivery"}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{selectedOrder.totalPrice || 0}
                </p>
              </div>

              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "16px",
                  background: "#ffffff",
                }}
              >
                <h4 style={{ margin: "0 0 12px", fontSize: "17px" }}>
                  Update Status
                </h4>

                <select
                  className="status-select"
                  value={selectedOrder.status || "Pending"}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder._id, e.target.value)
                  }
                  disabled={updatingId === selectedOrder._id}
                  style={{ width: "100%" }}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {updatingId === selectedOrder._id && (
                  <p style={{ fontSize: "12px", marginTop: "8px" }}>
                    Updating...
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                marginTop: "22px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  border: "none",
                  background: "#111827",
                  color: "#ffffff",
                  borderRadius: "10px",
                  padding: "11px 18px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}