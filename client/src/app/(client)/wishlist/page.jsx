"use client";

import Link from "next/link";
import ClientNavbar from "@/components/client/ClientNavbar";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <p className="text-gray-600">No items in wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlistItems.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded shadow"
              >
                <img
                  src={product.imageUrl || "/placeholder.png"}
                  className="w-full h-40 object-contain mb-3"
                />

                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-gray-500">{product.brand}</p>
                <p className="font-bold mt-2">₹{product.basePrice}</p>

                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/products/${product._id}`}
                    className="bg-black text-white px-3 py-2 rounded text-sm"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="bg-red-500 text-white px-3 py-2 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}