import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { normalizeEmail, isCollegeEmail } from "@/lib/auth";
import { generateOTP, sendOTPEmail } from "@/lib/otp";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isCollegeEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Only SIGCE student emails can request OTPs." }, { status: 400 });
    }

    const dbConnected = await connectToDatabase();
    if (!dbConnected) {
      return NextResponse.json({ error: "Database offline. Please try again later." }, { status: 503 });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    user.otpHash = otpHash;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.isEmailVerified = false;
    await user.save();

    await sendOTPEmail(user.email, otp, user.name);

    return NextResponse.json({ success: true, message: "A fresh OTP has been sent to your email." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
