import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  banner: { type: String, default: "" },
  bannerImage: { type: String, default: "" },
  date: { type: String, required: true },
  time: { type: String, default: "TBA" },
  venue: { type: String, default: "" },
  location: { type: String, default: "" },
  registrationDeadline: { type: String, default: "" },
  maxParticipants: { type: Number, required: true, default: 100 },
  registeredCount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ["upcoming", "past", "cancelled"], default: "upcoming" },
  rules: { type: [String], default: [] },
  prizes: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;
