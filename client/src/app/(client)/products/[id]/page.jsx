import ClientNavbar from "@/components/client/ClientNavbar";
import ProductDetailsClient from "@/components/client/ProductDetailsClient";

async function getProduct(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    return res.json();
  } catch (error) {
    console.error("Product details fetch error:", error);
    return null;
  }
}

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div>
        <ClientNavbar />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ProductDetailsClient product={product} />
      </div>
    </div>
  );
}