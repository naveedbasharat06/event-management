import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    ///validate the data
    console.log("reqBody", reqBody);
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({
        success: false,
        message: "User already exists",
      });
    }
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log("savedUser", savedUser);

    //send email to user
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message: "USER REGISTERD SUCCESSFULLY",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error });
  }
}
