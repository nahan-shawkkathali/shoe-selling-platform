"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientNavbar from "@/components/client/ClientNavbar";

export default function ProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: "",
    role: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const rawUser = localStorage.getItem("user");

    if (!rawUser) {
      router.push("/customer/login");
      return;
    }

    const user = JSON.parse(rawUser);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      profileImage: user.profileImage || "",
      role: user.role || "customer",
    });
  }, [router]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleSave(e) {
    e.preventDefault();
    setMessage("");

    if (!formData.name || !formData.email) {
      setMessage("Name and email are required.");
      return;
    }

    const oldUser = JSON.parse(localStorage.getItem("user") || "{}");

    const updatedUser = {
      ...oldUser,
      name: formData.name,
      email: formData.email,
      profileImage: formData.profileImage,
      role: formData.role || oldUser.role || "customer",
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("user-changed"));

    setMessage("Profile updated successfully.");
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-black">
      <ClientNavbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">
            Account
          </p>
          <h1 className="text-4xl font-bold">Edit Profile</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt={formData.name || "Profile"}
                  className="w-28 h-28 rounded-full object-cover border"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
                  {formData.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This saves locally in browser for now.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Role</label>
              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100 text-gray-500"
              />
            </div>

            {message && (
              <p
                className={`text-sm font-medium ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => router.push("/orders")}
                className="bg-gray-100 text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
              >
                My Orders
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}