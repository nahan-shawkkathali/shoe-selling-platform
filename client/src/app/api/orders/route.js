import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const customerName = searchParams.get("customerName");

    const filter = customerName ? { customerName } : {};

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("GET_ORDERS_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const {
      productId,
      productName,
      customerName,
      quantity,
      totalPrice,
      color,
      size,
      sku,
      imageUrl,
      phone,
      address,
      city,
      pincode,
      paymentMethod,
    } = await req.json();

    if (
      !productId ||
      !color ||
      !size ||
      !quantity ||
      !customerName ||
      !phone ||
      !address ||
      !city ||
      !pincode
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const variant = product.variants.find(
      (v) => String(v.color) === String(color) && String(v.size) === String(size)
    );

    if (!variant) {
      return NextResponse.json(
        { success: false, message: "Variant not found" },
        { status: 404 }
      );
    }

    if (Number(variant.stock) < Number(quantity)) {
      return NextResponse.json(
        { success: false, message: "Not enough stock" },
        { status: 400 }
      );
    }

    variant.stock = Number(variant.stock) - Number(quantity);
    await product.save();

    const finalImageUrl =
      imageUrl ||
      variant.imageUrl ||
      variant.image ||
      variant.variantImage ||
      variant.colorImage ||
      product.imageUrl ||
      product.image ||
      "";

    const newOrder = await Order.create({
      productId,
      customerName,
      productName: productName || product.name,
      quantity: Number(quantity),
      totalPrice: Number(totalPrice),
      status: "Pending",
      color,
      size,
      sku: sku || variant.sku || "",
      imageUrl: finalImageUrl,
      phone,
      address,
      city,
      pincode,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await connectDB();

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Order id and status are required" },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE_ORDER_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}