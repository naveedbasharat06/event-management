import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import CreateEvent from "@/models/createEventModel";

connectDB();
export async function GET(request: NextRequest) {
  try {
    const allEvents = await CreateEvent.find({});
    if (!allEvents) {
      return NextResponse.json({
        success: false,
        message: "No events found",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Events fetched successfully",
      allEvents,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error });
  }
}
