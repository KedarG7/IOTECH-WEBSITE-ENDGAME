import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { signToken, setSessionCookie, normalizeEmail, isCollegeEmail, getAdminCredentials } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    const admin = getAdminCredentials();

    if (normalizedEmail === admin.email && password === admin.password) {
      const token = signToken({
        userId: "admin",
        email: admin.email,
        role: "admin",
      });
      await setSessionCookie(token);

      return NextResponse.json({
        success: true,
        user: {
          id: "admin",
          name: "IOTECH Club Lead",
          email: admin.email,
          role: "admin",
        },
      });
    }

    if (!isCollegeEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Please use your college email ending with @sigce.edu.in." }, { status: 400 });
    }

    const dbConnected = await connectToDatabase();
    if (!dbConnected) {
      const mockToken = signToken({
        userId: "sandbox-id",
        email: normalizedEmail,
        role: "student",
      });
      await setSessionCookie(mockToken);
      return NextResponse.json({
        success: true,
        message: "Database offline. Sandbox login successful.",
        user: {
          id: "sandbox-id",
          name: "Sandbox Student",
          email: normalizedEmail,
          role: "student",
        }
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.isEmailVerified) {
      return NextResponse.json({ error: "Please verify your email with the OTP before logging in." }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
