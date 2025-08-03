# Revolt Motors Voice Assistant 🔊⚡

A real-time voice assistant web app built using **Node.js**, **Express**, and **Gemini Live API**, designed exclusively to provide users with detailed, spoken responses about **Revolt Electric Bikes**.

## 🚀 Features

- 🎙️ Real-time voice input and output
- ⚡ Uses Gemini 1.5 API (streaming)
- 🎯 Domain-restricted to Revolt Motors-related queries only
- 🌐 Server-to-server architecture
- 🧠 Low-latency, AI-powered answers
- 🔐 Secured via `.env` API key config

---

## 🛠️ Tech Stack

- **Frontend**: HTML, JavaScript, Web Speech API
- **Backend**: Node.js, Express
- **AI Model**: Google Gemini 1.5 Flash (Streaming)
- **Environment Config**: dotenv

---

## 📦 Installation

### 1. Clone the repo

bash
git clone https://github.com/your-username/revolt-voice-bot.git
cd revolt-voice-bot

npm install
GEMINI_API_KEY=your_google_api_key_here
node server.js




revolt-voice-bot/
├── public/             # Frontend HTML, CSS, JS
│   └── index.html
│   └── script.js
├── server.js           # Node.js backend
├── .env                # Your Gemini API key
├── package.json
└── README.md
