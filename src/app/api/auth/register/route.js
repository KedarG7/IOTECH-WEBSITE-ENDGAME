import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { normalizeEmail, isCollegeEmail } from "@/lib/auth";
import { generateOTP, sendOTPEmail } from "@/lib/otp";

export async function POST(req) {
  try {
    const { name, email, password, studentId, department, year } = await req.json();

    if (!name || !email || !password || !studentId || !department || !year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isCollegeEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Only @sigce.edu.in email addresses can register." }, { status: 400 });
    }

    const dbConnected = await connectToDatabase();
    if (!dbConnected) {
      const otp = generateOTP();
      const otpHash = await bcrypt.hash(otp, 10);
      const sandboxUser = {
        id: "sandbox-student-id",
        name: String(name).trim(),
        email: normalizedEmail,
        studentId: String(studentId).trim(),
        department: String(department).trim(),
        year: String(year).trim(),
        role: "student",
        isEmailVerified: false,
        otpHash,
      };

      await sendOTPEmail(normalizedEmail, otp, sandboxUser.name);
      return NextResponse.json({
        success: true,
        requiresVerification: true,
        message: "Account created. Please verify the OTP sent to your college email.",
        user: {
          id: sandboxUser.id,
          name: sandboxUser.name,
          email: sandboxUser.email,
          studentId: sandboxUser.studentId,
          department: sandboxUser.department,
          year: sandboxUser.year,
          role: sandboxUser.role,
        },
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      studentId: String(studentId).trim(),
      department: String(department).trim(),
      year: String(year).trim(),
      role: "student",
      isEmailVerified: false,
      otpHash,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOTPEmail(normalizedEmail, otp, user.name);

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Account created. Please verify the OTP sent to your college email to activate your student account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        year: user.year,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
