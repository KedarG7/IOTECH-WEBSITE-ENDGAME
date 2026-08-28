import mongoose, { Schema } from "mongoose";

const GallerySchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event" },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

export default Gallery;
