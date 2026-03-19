import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Event from "../models/Event.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // 1. Accept query and optional coordinates from the request body
    const { query, lat, lng } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Initialize the model with the Google Maps tool
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      tools: [{ googleMaps: {} }], // Enables live Maps access
      toolConfig: {
        retrievalConfig: {
          // This tells the AI exactly where "near me" is
          latLng: {
            latitude: lat || 28.6139, // Default to Delhi if not provided
            longitude: lng || 77.2090
          }
        }
      },
      // generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
        Return ONLY a raw JSON object. Do not include any conversational text or markdown formatting.
      
        Suggest a venue near the user's location for: "${query}".
      
        JSON Structure:
        {
          "venue_name": "...",
          "location": "...",
          "estimated_cost": "...",
          "why_it_fits": "..."
        }    
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    const cleanedText = text.replace(/```json|```/g, "").trim();
    const eventData = JSON.parse(cleanedText);
    const savedEvent = new Event({
      userQuery: query,
      ...eventData
    });
    await savedEvent.save();
    res.json(eventData);

  } catch (error) {
    console.error("Grounding Error:", error.message);
    res.status(500).json({ error: "Location search failed" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await Event.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;