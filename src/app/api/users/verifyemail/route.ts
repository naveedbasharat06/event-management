import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log(token);
    const user = await User.findOne({
      verifytoken: token,
      verifytokenexpiry: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Token is invalid or expired",
      });
    }
    console.log(user);
    user.isverified = true;
    user.verifytoken = undefined;
    user.verifytokenexpiry = undefined;
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error });
  }
}
