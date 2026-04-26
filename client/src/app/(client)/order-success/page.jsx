import Link from "next/link";
import ClientNavbar from "@/components/client/ClientNavbar";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <ClientNavbar />

      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <h1 className="text-4xl font-bold mb-4">
            Order Placed Successfully
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for shopping with Walkaholic. Your order has been placed.
          </p>

          <Link
            href="/products"
            className="inline-block bg-black text-white px-6 py-3 rounded"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}