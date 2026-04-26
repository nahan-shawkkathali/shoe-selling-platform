import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-3xl font-bold mb-3">Forgot Password?</h1>

        <p className="text-gray-600 mb-6">
          Password reset is not available yet. Please contact the store admin to
          reset your password.
        </p>

        <Link
          href="/customer/login"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}