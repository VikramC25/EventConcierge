import express from "express";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import Conversation from "../models/Conversation.js";
import crypto from "crypto";

const router = express.Router();

// System prompt that defines the AI's personality for event planning conversations
const SYSTEM_PROMPT = `You are EventConcierge, a friendly and knowledgeable event planning assistant.
You help users find and refine venue suggestions for their events.
When suggesting venues, include the venue name, location, estimated cost, and why it's a good fit.
When the user asks to refine (e.g., "something cheaper", "make it outdoor", "closer to downtown"),
use the context from the conversation to adjust your suggestion accordingly.
Keep responses concise and helpful. Format venue details clearly.`;

/**
 * POST /chat
 * Send a message in a conversation. Creates a new session if sessionId is not provided.
 * Body: { message: string, sessionId?: string }
 */
router.post("/", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. Find or create a conversation session
    let conversation;
    const sid = sessionId || crypto.randomUUID();

    conversation = await Conversation.findOne({ sessionId: sid });

    if (!conversation) {
      conversation = new Conversation({
        sessionId: sid,
        title: message.substring(0, 50), // Use first message as title
        messages: []
      });
    }

    // 2. Initialize LangChain Chat Model
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-3.1-flash-lite-preview",
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 3. Build the message history from stored conversation
    const langchainMessages = [
      new SystemMessage(SYSTEM_PROMPT)
    ];

    // Replay past messages to give the AI full context
    for (const msg of conversation.messages) {
      if (msg.role === "human") {
        langchainMessages.push(new HumanMessage(msg.content));
      } else if (msg.role === "ai") {
        langchainMessages.push(new AIMessage(msg.content));
      }
    }

    // Add the new user message
    langchainMessages.push(new HumanMessage(message));

    // 4. Invoke the model with the full conversation history
    const response = await llm.invoke(langchainMessages);

    // 5. Extract the AI's reply
    let aiReply = "";
    if (typeof response.content === "string") {
      aiReply = response.content;
    } else if (Array.isArray(response.content)) {
      aiReply = response.content.map(t => t.text || "").join("");
    }

    if (!aiReply) {
      throw new Error("AI returned an empty response.");
    }

    // 6. Save both messages to the conversation
    conversation.messages.push({ role: "human", content: message });
    conversation.messages.push({ role: "ai", content: aiReply });
    await conversation.save();

    // 7. Return the response
    res.json({
      sessionId: sid,
      reply: aiReply,
      messageCount: conversation.messages.length
    });

  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({ error: "Chat failed", details: error.message });
  }
});

/**
 * GET /chat/sessions
 * List all conversation sessions (most recent first)
 */
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Conversation.find()
      .select("sessionId title createdAt updatedAt")
      .sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

/**
 * GET /chat/:sessionId
 * Get full conversation history for a session
 */
router.get("/:sessionId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ sessionId: req.params.sessionId });
    if (!conversation) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

/**
 * DELETE /chat/:sessionId
 * Delete a conversation session
 */
router.delete("/:sessionId", async (req, res) => {
  try {
    await Conversation.findOneAndDelete({ sessionId: req.params.sessionId });
    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete session" });
  }
});

export default router;
