"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ClientNavbar from "@/components/client/ClientNavbar";
import { useWishlist } from "@/context/WishlistContext";

function HeartIcon({ active }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className={`h-5 w-5 ${active ? "text-red-500" : "text-gray-700"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.014-4.5-4.5-4.5-1.74 0-3.25.99-4.001 2.438A4.5 4.5 0 0 0 4.5 8.25c0 7.22 7.5 11.25 7.5 11.25s7.5-4.03 7.5-11.25Z"
      />
    </svg>
  );
}

function ProductCard({ product, toggleWishlist, isInWishlist }) {
  const images = useMemo(() => {
    const colorImageMap = new Map();

    product?.variants?.forEach((variant) => {
      const color = variant.color || "default";

      const img =
        variant.imageUrl ||
        variant.image ||
        variant.variantImage ||
        variant.colorImage;

      if (img && !colorImageMap.has(color)) {
        colorImageMap.set(color, img);
      }
    });

    const uniqueImages = [...colorImageMap.values()];

    if (uniqueImages.length === 0 && product?.imageUrl) {
      uniqueImages.push(product.imageUrl);
    }

    if (uniqueImages.length === 0 && product?.image) {
      uniqueImages.push(product.image);
    }

    return uniqueImages.length > 0 ? uniqueImages : ["/placeholder.png"];
  }, [product]);

  const [activeImage, setActiveImage] = useState(
    images[0] || "/placeholder.png"
  );
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    setActiveImage(images[0] || "/placeholder.png");
    setShowGallery(false);
  }, [images]);

  const colorCount = useMemo(() => {
    const colors =
      product?.variants?.map((variant) => variant.color).filter(Boolean) || [];

    return new Set(colors).size || images.length;
  }, [product, images]);

  function handleColorClick() {
    if (images.length > 1) {
      setShowGallery((prev) => !prev);
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:scale-105 hover:text-red-500"
        title={
          isInWishlist(product._id)
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >
        <HeartIcon active={isInWishlist(product._id)} />
      </button>

      <div className="relative bg-[#f8f8f8]">
        <div className="h-56 w-full p-4 flex items-center justify-center">
          <img
            src={activeImage}
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
        <button
          type="button"
          onClick={handleColorClick}
          className={`mb-2 text-xs uppercase tracking-wide ${
            images.length > 1
              ? "cursor-pointer text-gray-600 hover:text-black"
              : "cursor-default text-gray-500"
          }`}
        >
          {colorCount} {colorCount === 1 ? "COLOR" : "COLORS"}
        </button>

        {showGallery && images.length > 1 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {images.slice(0, 7).map((img, index) => (
              <button
                key={`${img}-${index}`}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`h-11 w-14 flex-shrink-0 rounded border bg-gray-50 p-1 transition ${
                  activeImage === img
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name}-${index + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>

        <h2 className="text-lg font-semibold mb-2 line-clamp-2">
          {product.name}
        </h2>

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
          View Product
        </Link>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortPrice, setSortPrice] = useState("default");

  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);

        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setProducts(data.products || []);
        } else if (res.ok && Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Products fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  const brands = useMemo(() => {
    return ["All", ...new Set(products.map((p) => p.brand).filter(Boolean))];
  }, [products]);

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const query = search.toLowerCase().trim();

    if (query) {
      result = result.filter((product) => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
        );
      });
    }

    if (selectedBrand !== "All") {
      result = result.filter((product) => product.brand === selectedBrand);
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortPrice === "low-high") {
      result.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
    }

    if (sortPrice === "high-low") {
      result.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
    }

    return result;
  }, [products, search, selectedBrand, selectedCategory, sortPrice]);

  function clearFilters() {
    setSearch("");
    setSelectedBrand("All");
    setSelectedCategory("All");
    setSortPrice("default");
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-black">
      <ClientNavbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">
            Our Collection
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">All Products</h1>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search shoes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
            />

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand === "All" ? "All Brands" : brand}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
            >
              <option value="default">Sort by Price</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-black hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                toggleWishlist={toggleWishlist}
                isInWishlist={isInWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}