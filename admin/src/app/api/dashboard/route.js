import { NextResponse } from "next/server";
import  connectDB  from "@/lib/mongodb";
import User from "@/models/users";
import Product from "@/models/products";
import Order from "@/models/order";

export async function GET() {
  try {
    await connectDB();

    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_DASHBOARD_STATS_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard stats.",
      },
      { status: 500 }
    );
  }
}