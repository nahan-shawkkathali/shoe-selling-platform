"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  SwatchIcon,
  ShoppingBagIcon,
} from "@/components/icons.jsx";

export default function Sidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);

  const menuItems = [
    { title: "Home", icon: HomeIcon, href: "/" },
    { title: "Users", icon: UsersIcon, href: "/users" },
    { title: "Products", icon: SwatchIcon, href: "/products" },
    { title: "Orders", icon: ShoppingBagIcon, href: "/orders" },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div>
        <h2 className="sidebar-title">Admin Panel</h2>

        <nav className="sidebar-nav">
          {menuItems.map((item, i) => {
            const Icon = item.icon;

            return (
              <Link key={i} href={item.href} className="sidebar-link">
                <div className="sidebar-link-inner">
                  <Icon />
                  <span>{item.title}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom" ref={profileRef}>
        {isProfileOpen && (
          <div className="sidebar-profile-dropdown">
            <div className="sidebar-profile-top">
              <div className="sidebar-profile-avatar-wrap">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name || "Profile"}
                    className="sidebar-profile-avatar-img"
                  />
                ) : (
                  <div className="sidebar-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
              </div>

              <p className="sidebar-profile-name">{user?.name || "Admin User"}</p>
              <p className="sidebar-profile-email">
                {user?.email || "admin@estore.com"}
              </p>
              <span className="sidebar-role-badge">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Administrator"}
              </span>
            </div>

            <div className="sidebar-profile-actions">
              <Link
                href="/profile"
                className="sidebar-profile-link"
                onClick={() => setIsProfileOpen(false)}
              >
                My Profile
              </Link>

              <button
                type="button"
                className="sidebar-profile-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="sidebar-user sidebar-user-btn"
          onClick={() => setIsProfileOpen((prev) => !prev)}
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name || "Profile"}
              className="sidebar-user-image"
            />
          ) : (
            <div className="sidebar-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
          )}

          <div className="sidebar-user-content">
            <p className="sidebar-user-name">{user?.name || "Admin User"}</p>
            <p className="sidebar-user-role">
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "Administrator"}
            </p>
          </div>

          <span className="sidebar-user-arrow">
            {isProfileOpen ? "▲" : "▼"}
          </span>
        </button>
      </div>
    </aside>
  );
}