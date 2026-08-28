import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "./db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "iotech-super-secret-key-change-in-prod";

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "lead@sigce.edu.in").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "Iotech@Lead2026",
  };
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isCollegeEmail(email) {
  const normalized = normalizeEmail(email);
  return /^[a-z0-9._%+-]+@sigce\.edu\.in$/i.test(normalized);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("iotech_session")?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    if (decoded.role === "admin") {
      const admin = getAdminCredentials();
      return {
        _id: "admin",
        id: "admin",
        name: "IOTECH Club Lead",
        email: decoded.email || admin.email,
        studentId: "ADMIN-LEAD",
        department: "Club Leadership",
        year: "N/A",
        role: "admin",
        profileImage: "",
        isEmailVerified: true,
        createdAt: new Date(),
      };
    }

    const dbConnected = await connectToDatabase();
    if (!dbConnected) {
      return {
        _id: decoded.userId,
        id: decoded.userId,
        name: decoded.role === "admin" ? "Club Admin" : "Mock Student",
        email: decoded.email,
        studentId: "MOCK-12345",
        department: "Computer Science",
        year: "3rd",
        role: decoded.role,
        profileImage: "",
        createdAt: new Date(),
      };
    }

    const user = await User.findById(decoded.userId).select("-password").lean();
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error in getAuthUser:", error);
    return null;
  }
}

export async function setSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set("iotech_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set("iotech_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
