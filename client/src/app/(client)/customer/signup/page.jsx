"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientNavbar from "@/components/client/ClientNavbar";

export default function CustomerSignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "customer",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage("Signup successful");
      router.push("/customer/login");
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white shadow rounded p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Customer Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-4 py-3"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-4 py-3"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-4 py-3"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-center text-red-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}