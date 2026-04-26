"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddUserScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add user");
        return;
      }

      router.push("/users");
      router.refresh();
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-page">
      <div className="add-user-card">
        <h1 className="add-user-title">Add User</h1>

        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="add-user-field">
            <label className="add-user-label">User Name*</label>
            <input
              type="text"
              name="name"
              className="add-user-input"
              placeholder="Enter User Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-user-field">
            <label className="add-user-label">Email*</label>
            <input
              type="email"
              name="email"
              className="add-user-input"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-user-field">
            <label className="add-user-label">User Type*</label>
            <select
              name="role"
              className="add-user-select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="add-user-field">
            <label className="add-user-label">Password*</label>
            <input
              type="password"
              name="password"
              className="add-user-input"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-user-field">
            <label className="add-user-label">Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              className="add-user-input"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {message && <p className="form-message">{message}</p>}

          <div className="add-user-actions">
            <button type="submit" className="add-user-submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>

            <Link href="/users" className="add-user-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}