"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const emptyVariant = {
  color: "",
  size: "",
  stock: "",
  sku: "",
};

export default function AddProductScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    basePrice: "",
    imageUrl: "",
  });

  const [variants, setVariants] = useState([{ ...emptyVariant }]);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { ...emptyVariant }]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) return;
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setMessage("Please select an image first.");
      return;
    }

    try {
      setUploadingImage(true);
      setMessage("");

      const uploadData = new FormData();
      uploadData.append("file", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Image upload failed.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.imageUrl,
      }));

      setMessage("Image uploaded successfully.");
    } catch (error) {
      console.error("UPLOAD_IMAGE_ERROR:", error);
      setMessage("Something went wrong while uploading image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          variants,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to save product.");
        setLoading(false);
        return;
      }

      setMessage("Product saved successfully.");

      setFormData({
        name: "",
        brand: "",
        category: "",
        description: "",
        basePrice: "",
        imageUrl: "",
      });

      setVariants([{ ...emptyVariant }]);
      setImageFile(null);

      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error("SUBMIT_PRODUCT_ERROR:", error);
      setMessage("Something went wrong while saving product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-page">
      <div className="product-form-card">
        <h1 className="product-form-title">Add Product</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="product-grid">
            <div className="product-field">
              <label className="product-label">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nike Air Max"
                className="product-input"
              />
            </div>

            <div className="product-field">
              <label className="product-label">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Nike"
                className="product-input"
              />
            </div>

            <div className="product-field">
              <label className="product-label">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Men Shoes"
                className="product-input"
              />
            </div>

            <div className="product-field">
              <label className="product-label">Base Price</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="2999"
                className="product-input"
              />
            </div>
          </div>

          <div className="product-field">
            <label className="product-label">Product Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="product-input"
            />

            <button
              type="button"
              onClick={handleImageUpload}
              className="variant-add-btn"
              disabled={uploadingImage}
              style={{ marginTop: "10px" }}
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </button>

            {formData.imageUrl ? (
              <div style={{ marginTop: "12px" }}>
                <img
                  src={formData.imageUrl}
                  alt="Uploaded Preview"
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="product-field">
            <label className="product-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              className="product-textarea"
            />
          </div>

          <div className="variants-section">
            <div className="variants-header">
              <h2>Variants</h2>
              <button
                type="button"
                className="variant-add-btn"
                onClick={addVariant}
              >
                + Add Variant
              </button>
            </div>

            {variants.map((variant, index) => (
              <div className="variant-row" key={index}>
                <input
                  type="text"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, "color", e.target.value)
                  }
                  className="product-input"
                />

                <input
                  type="text"
                  placeholder="Size"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, "size", e.target.value)
                  }
                  className="product-input"
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  className="product-input"
                />

                <input
                  type="text"
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={(e) =>
                    handleVariantChange(index, "sku", e.target.value)
                  }
                  className="product-input"
                />

                <button
                  type="button"
                  className="variant-remove-btn"
                  onClick={() => removeVariant(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {message ? <p className="form-message">{message}</p> : null}

          <button
            type="submit"
            className="product-submit-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}