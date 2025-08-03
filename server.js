// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Check if API key loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in .env");
  process.exit(1);
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${process.env.GEMINI_API_KEY}`;

// Instruction to limit assistant's domain
const systemInstruction = {
  role: "system",
  parts: [{
    text: `You are an AI voice assistant for Revolt Motors. Only provide information related to Revolt electric bikes, their specifications, pricing, availability, features, battery range, servicing, booking process, and showroom details.
If the user asks anything unrelated to Revolt Motors, respond with: "I'm here to assist you with Revolt Motors related queries only." Be concise, helpful, and friendly.`
  }]
};

app.post("/api/ask", async (req, res) => {
  const userText = req.body.text;

  if (!userText) {
    return res.status(400).json({ error: "Missing user input." });
  }

  try {
    const geminiResponse = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          systemInstruction,
          {
            role: "user",
            parts: [{ text: userText }]
          }
        ]
      },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "stream"
      }
    );

    let fullResponse = "";

    geminiResponse.data.on("data", chunk => {
      const lines = chunk.toString().split("\n").filter(line => line.trim() !== "");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textPart) {
              fullResponse += textPart;
            }
          } catch (err) {
            console.warn("⚠️ Error parsing chunk:", err);
          }
        }
      }
    });

    geminiResponse.data.on("end", () => {
      console.log("✅ Gemini stream complete.");
      res.json({ reply: fullResponse.trim() });
    });

    geminiResponse.data.on("error", err => {
      console.error("❌ Stream error:", err);
      res.status(500).json({ error: "Stream failed." });
    });

  } catch (error) {
    console.error("❌ API call failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Oops! Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
