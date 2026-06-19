require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

// Telegram setup
const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = process.env.BASE_URL;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Webhook endpoint
 */
app.post("/webhook", async (req, res) => {
  // Respond immediately (VERY IMPORTANT)
  res.sendStatus(200);

  try {
    const message = req.body?.message;
    if (!message || !message.text) return;

    const chatId = message.chat.id;
    const text = message.text.trim();

    console.log("📩 User:", text);

    let reply = "I didn't understand 🤖";

    if (text === "/start") {
      reply = "Welcome 🚀 Your bot is now running!";
    } 
    else if (text.toLowerCase() === "hi") {
      reply = "Hello 👋";
    } 
    else if (text.toLowerCase() === "bye") {
      reply = "Goodbye 👋";
    } 
    else if (text.toLowerCase() === "help") {
      reply = "Try: hi, bye, /start 🙂";
    } 
    else {
      reply = `You said: ${text}`;
    }

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: reply,
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
});

/**
 * Health check route
 */
app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

/**
 * Start server + auto webhook setup
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  if (!BASE_URL) {
    console.log("❌ BASE_URL missing in .env");
    return;
  }

  const webhookUrl = `${BASE_URL}/webhook`;

  console.log("\n🔗 SET THIS WEBHOOK:");
  console.log(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}`
  );

  try {
    const response = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${webhookUrl}`
    );

    console.log("\n✅ Webhook auto-set:", response.data.ok);
  } catch (err) {
    console.log("❌ Webhook setup :", err.message);
  }
});