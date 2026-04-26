"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ClientNavbar() {
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();

  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    function syncUser() {
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    }

    syncUser();

    window.addEventListener("storage", syncUser);
    window.addEventListener("user-changed", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("user-changed", syncUser);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-changed"));
    window.location.href = "/customer/login";
  }

  function formatName(name) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  if (!mounted) return null;

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Walkaholic
        </Link>

        <nav className="flex items-center gap-6 relative">
          <Link href="/" className="text-gray-700 hover:text-black font-medium">
            Home
          </Link>

          <Link
            href="/products"
            className="text-gray-700 hover:text-black font-medium"
          >
            Products
          </Link>

          <Link
            href="/orders"
            className="text-gray-700 hover:text-black font-medium"
          >
            Orders
          </Link>

          <Link
            href="/wishlist"
            className="relative text-gray-700 hover:text-black font-medium"
          >
            Wishlist
            {wishlistItems.length > 0 && (
              <span className="absolute -top-3 -right-5 min-w-5 h-5 px-1 rounded-full bg-black text-white text-xs flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-black font-medium"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-5 min-w-5 h-5 px-1 rounded-full bg-black text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {!user ? (
            <>
              <Link
                href="/customer/login"
                className="text-gray-700 hover:text-black font-medium"
              >
                Login
              </Link>

              <Link
                href="/customer/signup"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                title="Account"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name || "User"}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z"
                    />
                  </svg>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-5">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name || "User"}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-gray-800">
                        {formatName(user.name)}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="py-4 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-gray-700">Name:</span>{" "}
                      <span className="text-gray-600">
                        {formatName(user.name)}
                      </span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">
                        Email:
                      </span>{" "}
                      <span className="text-gray-600">{user.email}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Role:</span>{" "}
                      <span className="text-gray-600 capitalize">
                        {user.role}
                      </span>
                    </p>

                    <div className="pt-3 space-y-2">
                      <Link
                        href="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="block w-full text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-medium"
                      >
                        Edit Profile
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setShowDropdown(false)}
                        className="block w-full text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-medium"
                      >
                        My Orders
                      </Link>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}