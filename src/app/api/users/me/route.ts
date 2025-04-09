import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
connectDB();
export async function POST(request: NextRequest) {
  try {
    const userID = await getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error });
  }
}
