import "dotenv/config"; // High-priority import: loads .env immediately
import express from "express";
import mongoose from "mongoose";
import eventRoute from "./routes/event.js";
import chatRoute from "./routes/chat.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/generate-event", eventRoute);
app.use("/chat", chatRoute);

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/EventConcierge";

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in your .env file!");
  }
});