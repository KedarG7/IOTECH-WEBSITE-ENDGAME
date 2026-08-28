import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { signToken, setSessionCookie, normalizeEmail, isCollegeEmail } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isCollegeEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Only SIGCE student emails can be verified." }, { status: 400 });
    }

    const dbConnected = await connectToDatabase();
    if (!dbConnected) {
      return NextResponse.json({ error: "Database offline. Verification is unavailable right now." }, { status: 503 });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!user.otpHash || !user.otpExpiresAt || new Date(user.otpExpiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(String(otp).trim(), user.otpHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.otpHash = "";
    user.otpExpiresAt = null;
    await user.save();

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. Welcome to IOTECH.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
