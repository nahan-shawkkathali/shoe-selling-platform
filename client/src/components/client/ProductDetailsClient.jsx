"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ProductDetailsClient({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const colorImages = useMemo(() => {
    const map = new Map();

    if (product?.imageUrl) {
      map.set("main", product.imageUrl);
    }

    product?.variants?.forEach((variant) => {
      const color = variant.color || "default";
      const img =
        variant.imageUrl ||
        variant.image ||
        variant.variantImage ||
        variant.colorImage;

      if (img && !map.has(color)) {
        map.set(color, img);
      }
    });

    const result = [...map.values()];
    return result.length > 0 ? result : ["/placeholder.png"];
  }, [product]);

  const colors = useMemo(() => {
    const colorList =
      product?.variants?.map((variant) => variant.color).filter(Boolean) || [];

    return [...new Set(colorList)];
  }, [product]);

  const [activeImage, setActiveImage] = useState(
    colorImages[0] || "/placeholder.png"
  );
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setActiveImage(colorImages[0] || "/placeholder.png");
    setSelectedColor(colors[0] || "");
    setSelectedSize("");
  }, [colorImages, colors]);

  const availableSizes = useMemo(() => {
    return (
      product?.variants
        ?.filter((variant) => variant.color === selectedColor)
        ?.map((variant) => variant.size) || []
    );
  }, [product, selectedColor]);

  const selectedVariant = useMemo(() => {
    return product?.variants?.find(
      (variant) =>
        variant.color === selectedColor && variant.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  function handleColorChange(color) {
    setSelectedColor(color);
    setSelectedSize("");
    setMessage("");

    const variantImg = product?.variants?.find(
      (variant) => variant.color === color && variant.imageUrl
    )?.imageUrl;

    setActiveImage(variantImg || product?.imageUrl || "/placeholder.png");
  }

  function validateSelection() {
    if (!selectedColor || !selectedSize) {
      setMessage("Please select color and size.");
      return false;
    }

    if (!selectedVariant || Number(selectedVariant.stock) < 1) {
      setMessage("This variant is out of stock.");
      return false;
    }

    return true;
  }

  function addSelectedProductToCart() {
    const cartImage =
      selectedVariant?.imageUrl || activeImage || product?.imageUrl || "";

    addToCart({
      productId: product._id,
      name: product.name,
      brand: product.brand,
      price: Number(product.basePrice),
      imageUrl: cartImage,
      color: selectedColor,
      size: selectedSize,
      sku: selectedVariant?.sku || "",
    });
  }

  function handleAddToCart() {
    setMessage("");

    if (!validateSelection()) return;

    addSelectedProductToCart();
    setMessage("Added to cart successfully.");
  }

  function handleBuyNow() {
    setMessage("");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setMessage("Please login first.");
      router.push("/customer/login");
      return;
    }

    if (!validateSelection()) return;

    addSelectedProductToCart();
    router.push("/checkout");
  }

  return (
    <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded shadow">
      <div>
        <div className="bg-gray-50 rounded flex items-center justify-center p-6">
          <img
            src={activeImage}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
            className="w-full h-[420px] object-contain rounded"
          />
        </div>

        <div className="flex gap-3 mt-4 flex-wrap">
          {colorImages.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`w-20 h-20 rounded border bg-gray-50 p-1 ${
                activeImage === img ? "border-black" : "border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`${product.name}-${index + 1}`}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
                className="w-full h-full object-contain rounded"
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-3">{product.brand}</p>
        <p className="text-2xl font-bold mb-4">₹{product.basePrice}</p>
        <p className="text-gray-700 mb-6">{product.description}</p>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Select Color</h3>
          <div className="flex gap-3 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorChange(color)}
                className={`px-4 py-2 rounded border ${
                  selectedColor === color
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Select Size</h3>
          <div className="flex gap-3 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setSelectedSize(size);
                  setMessage("");
                }}
                className={`px-4 py-2 rounded border ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p>
            {selectedVariant
              ? selectedVariant.stock > 0
                ? `${selectedVariant.stock} available`
                : "Out of stock"
              : "Select variant"}
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleAddToCart} className="border px-6 py-3 rounded">
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="bg-black text-white px-6 py-3 rounded"
          >
            Buy Now
          </button>
        </div>

        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
}