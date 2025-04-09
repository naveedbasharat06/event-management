import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);
    const verified = await User.findOne({ email }).select("isverified");
    if (!verified?.isverified) {
      return NextResponse.json({
        success: false,
        message: "Please verify your email first",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid User" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({
        success: false,
        message: "Check your password",
      });
    }
    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username,
    };
    const token = await jwt.sign(tokenData, process.env.token!, {
      expiresIn: "1h",
    });
    const response = NextResponse.json({
      success: true,
      message: "Login Successfull",
      token,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60, // 10 seconds
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error });
  }
}
