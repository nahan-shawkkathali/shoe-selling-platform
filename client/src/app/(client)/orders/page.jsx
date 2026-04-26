"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ClientNavbar from "@/components/client/ClientNavbar";

const TRACKING_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

function getStepIndex(status) {
  if (status === "Cancelled") return -1;
  return TRACKING_STEPS.indexOf(status);
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Confirmed":
      return "bg-blue-100 text-blue-700";
    case "Shipped":
      return "bg-indigo-100 text-indigo-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          setMessage("Please login to view your orders.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `/api/orders?customerName=${encodeURIComponent(user.name)}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setOrders(data.orders || []);
        } else {
          setMessage(data.message || "Failed to load orders.");
        }
      } catch (error) {
        console.error("FETCH_CUSTOMER_ORDERS_ERROR:", error);
        setMessage("Something went wrong while loading orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : message ? (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600">{message}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 mb-4">No orders found.</p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-5 py-2 rounded"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getStepIndex(order.status);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    <img
                      src={order.imageUrl || "/placeholder.png"}
                      alt={order.productName}
                      className="w-28 h-28 object-contain bg-gray-50 rounded-xl"
                    />

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold">
                            {order.productName}
                          </h2>

                          <p className="text-gray-600 mt-1">
                            Color: {order.color || "-"} | Size:{" "}
                            {order.size || "-"}
                          </p>

                          <p className="text-gray-600">
                            Quantity: {order.quantity}
                          </p>

                          <p className="font-bold mt-2">
                            ₹{order.totalPrice}
                          </p>
                        </div>

                        <div className="md:text-right">
                          <span
                            className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                          <p className="text-sm text-gray-500 mt-3">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>

                      {order.status === "Cancelled" ? (
                        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                          This order has been cancelled.
                        </div>
                      ) : (
                        <div className="mt-6">
                          <div className="grid grid-cols-4 gap-2">
                            {TRACKING_STEPS.map((step, index) => {
                              const completed = index <= currentStep;

                              return (
                                <div key={step} className="text-center">
                                  <div
                                    className={`mx-auto mb-2 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                      completed
                                        ? "bg-black text-white"
                                        : "bg-gray-200 text-gray-500"
                                    }`}
                                  >
                                    {index + 1}
                                  </div>

                                  <div
                                    className={`h-1 rounded-full mb-2 ${
                                      completed ? "bg-black" : "bg-gray-200"
                                    }`}
                                  />

                                  <p
                                    className={`text-xs font-semibold ${
                                      completed
                                        ? "text-black"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}