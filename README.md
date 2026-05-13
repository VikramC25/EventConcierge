# 🎯 EventConcierge

An AI-powered event planning assistant that suggests real-world venues using **Google Gemini** with live **Google Maps grounding**, and offers a multi-turn **conversational chat** powered by **LangChain** for iterative event refinement.

---

## ✨ Features

### 🗺️ Quick Plan — Instant Venue Suggestions
- Enter your event requirements in natural language
- AI returns a real venue grounded in **live Google Maps data**
- Location-aware — uses your coordinates for nearby results
- Structured JSON response with venue name, location, cost and rationale
- All suggestions saved to MongoDB for future reference

### 💬 Chat Assistant — Conversational Planning (LangChain)
- Multi-turn conversations with **persistent memory**
- Refine your event iteratively: *"something cheaper"*, *"make it outdoor"*, *"closer to downtown"*
- Session management — create, load, and revisit past conversations
- Conversation history stored in MongoDB

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express 5 |
| **AI (Quick Plan)** | Google Gemini API with Google Maps Grounding |
| **AI (Chat)** | LangChain (ChatGoogleGenerativeAI, LangChain Core) |
| **Database** | MongoDB with Mongoose 9 |
| **Frontend** | HTML, Tailwind CSS, Vanilla JS |

---

## 📁 Project Structure

```
EventConcierge/
├── server.js                  # Express server entry point
├── routes/
│   ├── event.js               # Quick Plan — single-shot venue generation (Gemini + Maps)
│   └── chat.js                # Chat Assistant — multi-turn conversation (LangChain)
├── models/
│   ├── Event.js               # MongoDB schema for venue suggestions
│   └── Conversation.js        # MongoDB schema for chat sessions
├── public/
│   └── index.html             # Frontend with tabbed UI
├── .env                       # API keys and MongoDB URI
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Google Gemini API Key](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/VikramC25/EventConcierge.git
cd EventConcierge

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string_here
```

### Run the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

### Quick Plan (Gemini + Google Maps)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /generate-event | Generate a venue suggestion |
| GET | /generate-event/history | Get all past suggestions |

**POST Body:**
```json
{
  "query": "A quiet cafe for a study group",
  "lat": 28.6139,
  "lng": 77.2090
}
```

### Chat Assistant (LangChain)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /chat | Send a message in a conversation |
| GET | /chat/sessions | List all chat sessions |
| GET | /chat/:sessionId | Get full conversation history |
| DELETE | /chat/:sessionId | Delete a session |

**POST Body:**
```json
{
  "message": "Find me a birthday party venue in South Delhi",
  "sessionId": "optional-existing-session-id"
}
```

---

## 🧠 How LangChain is Used

The Chat Assistant uses LangChain's ChatGoogleGenerativeAI to enable **conversation memory**:

1. Each chat session stores messages in MongoDB
2. On every new message, the full conversation history is reconstructed as LangChain HumanMessage / AIMessage objects
3. A SystemMessage prompt defines the AI's event-planning personality
4. The model receives the complete context, enabling follow-up refinements like:
   - *"Find me a venue"* → *"Something cheaper"* → *"Make it outdoor"*

---

## 📄 License

ISC
