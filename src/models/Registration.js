import mongoose, { Schema } from "mongoose";

const RegistrationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
  registrationId: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ["confirmed", "cancelled", "attended"], default: "confirmed" },
  registeredAt: { type: Date, default: Date.now },
});

RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true, partialFilterExpression: { status: "confirmed" } });

const Registration = mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);

export default Registration;
