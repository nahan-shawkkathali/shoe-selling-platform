"use client";

import Link from "next/link";
import ClientNavbar from "@/components/client/ClientNavbar";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-6 py-3 rounded"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
                >
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    className="w-28 h-28 object-contain bg-gray-50 rounded"
                  />

                  <div className="flex-1">
                    <h2 className="font-bold text-lg">{item.name}</h2>
                    <p className="text-gray-500">{item.brand}</p>
                    <p className="text-sm text-gray-600">
                      Color: {item.color} | Size: {item.size}
                    </p>
                    <p className="font-bold mt-2">₹{item.price}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.productId,
                            item.color,
                            item.size
                          )
                        }
                        className="border px-3 py-1 rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.productId,
                            item.color,
                            item.size
                          )
                        }
                        className="border px-3 py-1 rounded"
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.productId,
                            item.color,
                            item.size
                          )
                        }
                        className="text-red-600 ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <div className="flex justify-between mb-3">
                <span>Total</span>
                <span className="font-bold">₹{cartTotal}</span>
              </div>

              <Link
                href="/checkout"
                className="block text-center bg-black text-white py-3 rounded mt-6"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}