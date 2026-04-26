"use client";

import { useRouter } from "next/navigation";
import ClientNavbar from "@/components/client/ClientNavbar";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handlePlaceOrder() {
    setMessage("");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      router.push("/customer/login");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    if (
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      setMessage("Please fill all delivery details.");
      return;
    }

    try {
      setLoading(true);

      for (const item of cartItems) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.productId,
            productName: item.name,
            customerName: user.name,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity,
            color: item.color,
            size: item.size,
            sku: item.sku,
            imageUrl: item.imageUrl,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
            paymentMethod: formData.paymentMethod,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Order failed");
        }
      }

      clearCart();
      router.push("/order-success");
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Delivery Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                />

                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>

              <textarea
                name="address"
                placeholder="Full delivery address"
                value={formData.address}
                onChange={handleChange}
                className="mt-4 w-full min-h-28 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Order Items</h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-600">No items in cart.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      className="flex gap-4 border-b pb-4"
                    >
                      <img
                        src={item.imageUrl || "/placeholder.png"}
                        alt={item.name}
                        className="w-24 h-24 object-contain bg-gray-50 rounded"
                      />

                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        <p className="text-sm text-gray-600">
                          {item.color} / Size {item.size}
                        </p>
                        <p className="font-semibold">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>

            <div className="flex justify-between mb-3">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Payment</span>
              <span>{formData.paymentMethod}</span>
            </div>

            <div className="flex justify-between border-t pt-4 mt-4">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{cartTotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full bg-black text-white py-3 rounded mt-6 disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}