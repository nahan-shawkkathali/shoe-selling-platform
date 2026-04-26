"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProductScreen({ productId }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    basePrice: "",
    imageUrl: "",
    variants: [],
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setMessage("");

        const res = await fetch(`/api/products?id=${productId}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setFormData({
            name: data.product.name || "",
            brand: data.product.brand || "",
            category: data.product.category || "",
            description: data.product.description || "",
            basePrice: data.product.basePrice || "",
            imageUrl: data.product.imageUrl || "",
            variants: data.product.variants?.length
              ? data.product.variants
              : [{ color: "", size: "", stock: "", sku: "" }],
          });
        } else {
          setMessage(data.message || "Failed to load product");
        }
      } catch (error) {
        console.error("FETCH_PRODUCT_ERROR:", error);
        setMessage("Something went wrong while loading product");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  const addVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { color: "", size: "", stock: "", sku: "" },
      ],
    }));
  };

  const removeVariantRow = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants.length
        ? updatedVariants
        : [{ color: "", size: "", stock: "", sku: "" }],
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      let updatedImageUrl = formData.imageUrl;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadRes.json();

        if (!uploadRes.ok || !uploadResult.success) {
          setMessage(uploadResult.message || "Image upload failed");
          return;
        }

        updatedImageUrl = uploadResult.imageUrl;
      }

      const res = await fetch(`/api/products?id=${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: updatedImageUrl,
          basePrice: Number(formData.basePrice),
          variants: formData.variants.map((variant) => ({
            color: variant.color.trim(),
            size: variant.size.trim(),
            stock: Number(variant.stock),
            sku: variant.sku.trim(),
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Updated successfully");
        router.push("/products");
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (error) {
      console.error("UPDATE_PRODUCT_ERROR:", error);
      setMessage("Something went wrong while updating");
    }
  }

  if (loading) return <p className="page-container">Loading...</p>;

  return (
    <div className="product-form-page">
      <div className="product-form-card">
        <h1 className="product-form-title">Edit Product</h1>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="product-grid">
            <div className="product-field">
              <label className="product-label">Product Name</label>
              <input
                className="product-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="product-field">
              <label className="product-label">Brand</label>
              <input
                className="product-input"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>

            <div className="product-field">
              <label className="product-label">Category</label>
              <input
                className="product-input"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="product-field">
              <label className="product-label">Base Price</label>
              <input
                className="product-input"
                name="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="product-field">
            <label className="product-label">Current Image URL</label>
            <input
              className="product-input"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="product-field">
            <label className="product-label">Upload New Image</label>
            <input
              className="product-input"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          {formData.imageUrl ? (
            <div className="product-field">
              <label className="product-label">Image Preview</label>
              <img
                src={formData.imageUrl}
                alt={formData.name || "Product image"}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          ) : null}

          <div className="product-field">
            <label className="product-label">Description</label>
            <textarea
              className="product-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="variants-section">
            <div className="variants-header">
              <h2>Variants</h2>
              <button
                type="button"
                className="variant-add-btn"
                onClick={addVariantRow}
              >
                Add Variant
              </button>
            </div>

            {formData.variants.map((variant, index) => (
              <div className="variant-row" key={index}>
                <input
                  className="product-input"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, "color", e.target.value)
                  }
                />

                <input
                  className="product-input"
                  placeholder="Size"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, "size", e.target.value)
                  }
                />

                <input
                  className="product-input"
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                />

                <input
                  className="product-input"
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={(e) =>
                    handleVariantChange(index, "sku", e.target.value)
                  }
                />

                <button
                  type="button"
                  className="variant-remove-btn"
                  onClick={() => removeVariantRow(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {message && <p className="form-message">{message}</p>}

          <button type="submit" className="product-submit-btn">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}