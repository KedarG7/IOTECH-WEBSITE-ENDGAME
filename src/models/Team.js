import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { 
    type: String, 
    enum: ["core", "technical", "design", "event", "marketing", "advisory", "other"], 
    required: true,
    default: "technical" 
  },
  profileImage: { type: String, required: true },
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
  },
  order: { type: Number, default: 99 },
});

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);

export default Team;
