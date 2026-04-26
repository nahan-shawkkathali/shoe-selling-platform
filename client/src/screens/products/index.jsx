"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);

      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProducts(data.products || []);
      } else {
        console.error("FETCH PRODUCTS FAILED:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("FETCH_PRODUCTS_ERROR:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDeleteProduct(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete product.");
        return;
      }

      fetchProducts();
    } catch (error) {
      console.error("DELETE_PRODUCT_ERROR:", error);
      alert("Something went wrong while deleting product.");
    }
  }

  function getTotalStock(variants = []) {
    return variants.reduce(
      (total, variant) => total + (Number(variant.stock) || 0),
      0
    );
  }

  function getVariantSummary(variants = []) {
    return variants
      .slice(0, 2)
      .map((variant) => `${variant.color} / ${variant.size}`)
      .join(", ");
  }

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return products;

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    });
  }, [products, search]);

  return (
    <div className="page-container">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage product catalog and variants</p>
        </div>

        <Link href="/products/add" className="page-link-btn">
          Add Product
        </Link>
      </div>

      <div className="page-search-wrap">
        <input
          type="text"
          className="page-search-input"
          placeholder="Search by product name, brand, or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="user-table-wrap">
        <table className="user-table">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Base Price</th>
              <th>Variants</th>
              <th>Total Stock</th>
              <th>Variant Summary</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="9">No matching products found.</td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>₹{product.basePrice}</td>
                  <td>{product.variants?.length || 0}</td>
                  <td>{getTotalStock(product.variants)}</td>
                  <td>
                    {product.variants?.length
                      ? `${getVariantSummary(product.variants)}${
                          product.variants.length > 2 ? "..." : ""
                        }`
                      : "-"}
                  </td>
                  <td>
                    <Link href={`/products/edit/${product._id}`}>
                      <button className="table-edit-btn">Edit</button>
                    </Link>
                    <button
                      className="table-delete-btn"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}