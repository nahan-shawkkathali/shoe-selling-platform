"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    profileImage: "",
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/auth/profile");
        const data = await response.json();

        if (data.success) {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            role: data.user.role || "",
            profileImage: data.user.profileImage || "",
          });

          setPreview(data.user.profileImage || "");
        }
      } catch (error) {
        console.error("FETCH_PROFILE_ERROR:", error);
      }
    }

    fetchProfile();
  }, []);

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
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          profileImage: formData.profileImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update profile");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="add-user-card">
        <h1 className="add-user-title">My Profile</h1>

        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="profile-image-section">
            <div className="profile-image-preview-wrap">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="profile-image-preview"
                />
              ) : (
                <div className="profile-image-placeholder">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "A"}
                </div>
              )}
            </div>

            <div className="add-user-field">
              <label className="add-user-label">Change Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="profile-file-input"
              />
            </div>
          </div>

          <div className="add-user-field">
            <label className="add-user-label">Name</label>
            <input
              type="text"
              name="name"
              className="add-user-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="add-user-field">
            <label className="add-user-label">Email</label>
            <input
              type="email"
              name="email"
              className="add-user-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="add-user-field">
            <label className="add-user-label">Role</label>
            <input
              type="text"
              className="add-user-input"
              value={
                formData.role
                  ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
                  : ""
              }
              readOnly
            />
          </div>

          {message && <p className="form-message">{message}</p>}

          <div className="add-user-actions">
            <button type="submit" className="add-user-submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}