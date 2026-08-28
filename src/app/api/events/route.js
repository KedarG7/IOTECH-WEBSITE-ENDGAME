import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");

    const query = {};
    if (category && category !== "All") query.category = category;
    if (status) query.status = status;

    const events = await Event.find(query).sort({ date: 1 }).lean();
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Fetch Events Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();

    const title = String(body.title || "").trim();
    if (!title || !body.date) {
      return NextResponse.json({ error: "Title and date are required." }, { status: 400 });
    }

    const slug = String(body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")).trim();
    const location = String(body.location || body.venue || "Campus").trim();
    const bannerImage = String(body.bannerImage || body.banner || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop").trim();
    const description = String(body.description || "").trim();
    const category = String(body.category || "Workshop").trim();
    const time = String(body.time || "TBA").trim();
    const registrationDeadline = String(body.registrationDeadline || body.date || "").trim();
    const maxParticipants = Number(body.maxParticipants || 100);

    const event = await Event.create({
      ...body,
      title,
      slug,
      category,
      description,
      banner: bannerImage,
      bannerImage,
      date: body.date,
      time,
      venue: location,
      location,
      registrationDeadline,
      maxParticipants,
      status: body.status || "upcoming",
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error("Create Event Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
