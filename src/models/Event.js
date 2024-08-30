import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  guests: [guestSchema],
  contributions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Contribution" },
  ],
  closed: { type: Boolean, default: false },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
