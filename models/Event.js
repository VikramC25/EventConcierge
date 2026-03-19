import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  userQuery: String,
  venue_name: String,
  location: String,
  estimated_cost: String,
  why_it_fits: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Event", eventSchema);