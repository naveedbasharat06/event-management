import { connectDB } from "@/dbConfig/dbConfig";

import { NextResponse, NextRequest } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout Successfull",
    });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error });
  }
}
