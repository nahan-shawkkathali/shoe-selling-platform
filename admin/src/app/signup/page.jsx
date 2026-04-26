"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: "",
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;
      setPreview(base64);
      setFormData((prev) => ({
        ...prev,
        profileImage: base64,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.message || "Signup failed");
        return;
      }

      setMessageType("success");
      setMessage("Admin signup successful. Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      setMessageType("error");
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-badge">Walkaholic Admin</p>
          <h1 className="auth-title">Create admin account</h1>
          <p className="auth-subtitle">
            Sign up to access the admin management panel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field auth-image-field">
            <label className="auth-label">Profile Picture</label>

            <div className="auth-image-preview-wrap">
              {preview ? (
                <img src={preview} alt="Preview" className="auth-image-preview" />
              ) : (
                <div className="auth-image-placeholder">A</div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="auth-file-input"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="auth-input"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              placeholder="Create a password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Signing up..." : "Create Admin Account"}
          </button>

          {message && (
            <p
              className={`auth-message ${
                messageType === "success" ? "auth-success" : "auth-error"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}