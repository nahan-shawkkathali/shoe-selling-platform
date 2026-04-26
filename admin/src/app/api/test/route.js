import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();

  return Response.json({ success: true, message: "Database connected!" });
}