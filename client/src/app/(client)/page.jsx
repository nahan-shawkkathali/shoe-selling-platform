"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ClientNavbar from "@/components/client/ClientNavbar";

export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/customer/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    async function loadProducts() {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setProducts(data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Home products fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [router]);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  const heroImages = useMemo(() => {
    const imageList = [];

    products.forEach((product) => {
      if (product.imageUrl) imageList.push(product.imageUrl);
      if (product.image) imageList.push(product.image);

      product.variants?.forEach((variant) => {
        if (variant.imageUrl) imageList.push(variant.imageUrl);
        if (variant.image) imageList.push(variant.image);
        if (variant.variantImage) imageList.push(variant.variantImage);
        if (variant.colorImage) imageList.push(variant.colorImage);
      });
    });

    const uniqueImages = [...new Set(imageList.filter(Boolean))];

    return uniqueImages.length > 0 ? uniqueImages : ["/placeholder.png"];
  }, [products]);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [heroImages]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-black">
      <ClientNavbar />

      <section className="bg-black text-white py-14">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="flex justify-center">
            <div className="w-full max-w-md h-[260px] md:h-[300px] rounded-2xl bg-white p-4 shadow-lg flex items-center justify-center overflow-hidden">
              <img
                key={heroImages[heroIndex]}
                src={heroImages[heroIndex] || "/placeholder.png"}
                alt="Hero Shoe"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
                className="max-h-full max-w-full object-contain transition-all duration-700 ease-in-out animate-pulse"
              />
            </div>
          </div>

          <div>
            <span className="inline-block text-sm bg-white/10 px-4 py-1.5 rounded-full">
              New Collection
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4 leading-tight">
              Find Your Perfect Shoes
            </h1>

            <p className="text-gray-300 mb-6 max-w-xl">
              Explore stylish, comfortable, and high-quality shoes for every
              occasion.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
              >
                Shop Now
              </Link>

              <Link
                href="/products"
                className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
              >
                Explore
              </Link>
            </div>

            <div className="flex gap-8 mt-8">
              <div>
                <p className="text-2xl font-bold">{products.length}+</p>
                <p className="text-sm text-gray-400">Products</p>
              </div>

              <div>
                <p className="text-2xl font-bold">Top</p>
                <p className="text-sm text-gray-400">Brands</p>
              </div>

              <div>
                <p className="text-2xl font-bold">Fast</p>
                <p className="text-sm text-gray-400">Delivery</p>
              </div>
            </div>

            {heroImages.length > 1 && (
              <div className="mt-6 flex gap-2">
                {heroImages.slice(0, 6).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setHeroIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      heroIndex === index
                        ? "w-8 bg-white"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Show hero image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">
              Featured Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured Products
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center justify-center rounded-full border border-black/10 bg-white px-5 py-2.5 font-medium shadow-sm transition hover:-translate-y-0.5"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : featuredProducts.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative bg-[#f8f8f8]">
                  <div className="h-56 w-full p-4 flex items-center justify-center">
                    <img
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                      className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-[11px] font-semibold text-white">
                    {product.category || "New"}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-2xl font-bold">₹{product.basePrice}</p>
                    <p className="text-sm text-gray-500">
                      {product.variants?.length || 0} variants
                    </p>
                  </div>

                  <Link
                    href={`/products/${product._id}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}