import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  studentId: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  profileImage: { type: String, default: "" },
  isEmailVerified: { type: Boolean, default: false },
  otpHash: { type: String, default: "" },
  otpExpiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
