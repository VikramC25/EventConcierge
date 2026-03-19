EventConcierge

EventConcierge is a minimalist, AI-powered venue discovery tool. It leverages the Gemini 3.1 Flash model with real-time Google Maps Grounding to suggest actual, open venues based on natural language requests. Every proposal is persisted to a database, allowing users to build a curated history of event plans.

Features:
Grounded AI Proposals: Uses live Google Maps data to ensure suggested venues exist and are relevant to the user's location.

Persistent Memory: Integrated with MongoDB to store every user query and corresponding AI suggestion.

Minimalist Interface: A stark, "calculator-style" UI designed for utility and clarity, inspired by professional audio tools.

Search History: A dedicated dashboard to review and revisit previous event proposals instantly.

Tech Stack:
Backend: Node.js, Express.js

AI: Google Generative AI SDK (gemini-3.1-flash-lite-preview)

Database: MongoDB & Mongoose (Object Modeling)

Frontend: HTML5, Vanilla JavaScript, Tailwind CSS

Local Installation:
Follow these steps to get a local development environment running:

1. Prerequisites
Node.js (v18+ recommended)

MongoDB Compass (for local DB viewing)

A Google Gemini API Key from Google AI Studio

2. Clone the Repository
  git clone https://github.com/your-username/EventConcierge.git
  cd EventConcierge

3. Install Dependencies
   npm install

4. Configure Environment Variables
   Create a .env file in the root directory and add your credentials:
   GEMINI_API_KEY=your_actual_api_key_here
   MONGO_URI=mongodb://127.0.0.1:27017/EventConcierge
   PORT=3000

5. Run the Application
   node server.js
The server will start on http://localhost:3000.

Project Structure

EventConcierge/
├── models/
│   └── Event.js        # Mongoose Schema for event proposals
├── public/
│   └── index.html      # Minimalist Frontend UI
├── routes/
│   └── event.js        # AI Logic & DB Routes
├── .env                # API Keys (Git ignored)
├── package.json        # Dependencies & Scripts
└── server.js           # Main Entry Point

