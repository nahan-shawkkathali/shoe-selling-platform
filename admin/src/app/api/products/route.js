import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import products from "@/models/products";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const product = await products.findById(id);

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: "Product not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Product fetched successfully",
          product,
        },
        { status: 200 }
      );
    }

    const allProducts = await products.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        products: allProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      brand,
      category,
      description,
      basePrice,
      imageUrl,
      variants,
    } = body;

    if (!name || !brand || !category || !description || !basePrice) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are required",
        },
        { status: 400 }
      );
    }

    const normalizedVariants = (variants || []).map((variant) => ({
      color: variant.color,
      size: variant.size,
      stock: Number(variant.stock),
      sku: variant.sku,
      imageUrl: variant.imageUrl || "",
    }));

    const product = await products.create({
      name,
      brand,
      category,
      description,
      basePrice: Number(basePrice),
      imageUrl: imageUrl || "",
      variants: normalizedVariants,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product id is required",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      name,
      brand,
      category,
      description,
      basePrice,
      imageUrl,
      variants,
    } = body;

    if (!name || !brand || !category || !description || !basePrice) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are required",
        },
        { status: 400 }
      );
    }

    const normalizedVariants = (variants || []).map((variant) => ({
      color: variant.color,
      size: variant.size,
      stock: Number(variant.stock),
      sku: variant.sku,
      imageUrl: variant.imageUrl || "",
    }));

    const updatedProduct = await products.findByIdAndUpdate(
      id,
      {
        name,
        brand,
        category,
        description,
        basePrice: Number(basePrice),
        imageUrl: imageUrl || "",
        variants: normalizedVariants,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product id is required",
        },
        { status: 400 }
      );
    }

    const deletedProduct = await products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}