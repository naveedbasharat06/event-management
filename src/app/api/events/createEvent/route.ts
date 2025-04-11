import { connectDB } from "@/dbConfig/dbConfig";
import CreateEvent from "@/models/createEventModel";
import { NextResponse, NextRequest } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      ticketPrice,
      eventImage,
    } = reqBody;
    if (
      !eventName ||
      !eventDate ||
      !eventLocation ||
      !eventDescription ||
      ticketPrice == null ||
      !eventImage
    ) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    ///validate the data
    console.log("reqBody", reqBody);
    const event = await CreateEvent.findOne({ eventName });
    if (event) {
      return NextResponse.json({
        success: false,
        message: "Event already exists",
      });
    }
    const newEvent = new CreateEvent({
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      ticketPrice,
      eventImage,
    });
    const savedEvent = await newEvent.save();
    console.log("savedEvent", savedEvent);

    return NextResponse.json({
      message: "EVENT CREATED SUCCESSFULLY",
      success: true,
      savedEvent,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error });
  }
}
