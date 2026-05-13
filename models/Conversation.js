import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["human", "ai"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  title: { type: String, default: "New Conversation" },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update the updatedAt field on save
conversationSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

export default mongoose.model("Conversation", conversationSchema);
