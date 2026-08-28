import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import { getAuthUser, isCollegeEmail } from "@/lib/auth";
import { sendEventRegistrationEmail } from "@/lib/otp";

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    await connectToDatabase();

    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");

    const query = {};
    if (user.role === "student") {
      query.userId = user._id;
    }
    if (user.role === "admin" && eventId) {
      query.eventId = eventId;
    }

    const registrations = await Registration.find(query)
      .populate("userId", "-password")
      .populate("eventId")
      .sort({ registeredAt: -1 })
      .lean();

    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error("Fetch Registrations Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login to register." }, { status: 401 });
    }

    if (user.role !== "student" || !isCollegeEmail(user.email)) {
      return NextResponse.json({ error: "Only SIGCE students with a valid college email can register for events." }, { status: 403 });
    }

    await connectToDatabase();
    const { eventId } = await req.json();

    if (!eventId || !mongoose.isValidObjectId(String(eventId))) {
      return NextResponse.json({ error: "Invalid event ID." }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "upcoming") {
      return NextResponse.json({ error: "Registration is closed for this event." }, { status: 400 });
    }

    if (event.registeredCount >= event.maxParticipants) {
      return NextResponse.json({ error: "Event is full." }, { status: 400 });
    }

    const existing = await Registration.findOne({ userId: user._id, eventId });
    if (existing) {
      return NextResponse.json({ error: "You are already registered for this event." }, { status: 400 });
    }

    const registrationId = `REG-${Math.floor(100000 + Math.random() * 900000)}`;

    const registration = await Registration.create({
      userId: user._id,
      eventId: event._id,
      registrationId,
      status: "confirmed"
    });

    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    await sendEventRegistrationEmail(user.email, user.name, {
      title: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue || event.location,
      location: event.location,
    }, registration.registrationId);

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (error) {
    console.error("Create Registration Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
