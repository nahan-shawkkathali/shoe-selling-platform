import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/order";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_ORDERS_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { customerName, productName, quantity, totalPrice, status } = body;

    if (!customerName || !productName || !quantity || !totalPrice) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      customerName: customerName.trim(),
      productName: productName.trim(),
      quantity: Number(quantity),
      totalPrice: Number(totalPrice),
      status: status?.trim() || "Pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully.",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Order id and status are required.",
        },
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
        {
          success: false,
          message: "Invalid order status.",
        },
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
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully.",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE_ORDER_STATUS_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status.",
      },
      { status: 500 }
    );
  }
}