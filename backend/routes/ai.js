const express = require("express");
const axios = require("axios");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_PUBLIC_KEY);

// Helper: download and convert image to base64
async function getBase64FromUrl(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data).toString("base64");
}

router.post("/generate-ai-response", async (req, res) => {
  try {
    const { message, chatHistory = [], image } = req.body;
    console.log(message, "message");
    console.log(chatHistory, "chatHistory");
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const inputParts = [];

    // Add chat history to inputParts
    const last10Messages = chatHistory.slice(-10);
    for (const chat of last10Messages) {
      if (chat.role === "user") {
        inputParts.push({ text: `User: ${chat.content}` });
      } else if (chat.role === "ai") {
        inputParts.push({ text: `AI: ${chat.content}` });
      }
    }
    console.log(inputParts, "inputParts");

    // Handle image if provided
    const imageUrl = typeof image === "string" ? image : image?.url || image?.path;
    console.log(imageUrl, "imageUrl");

    if (imageUrl) {
      const fullUrl = `https://ik.imagekit.io/hicgxab6ot${imageUrl}`;
      const base64Image = await getBase64FromUrl(fullUrl);
      inputParts.push({
        inlineData: {
          mimeType: "image/png", // adjust if you use jpg
          data: base64Image,
        },
      });
    }

    // Add the current message from user
    inputParts.push({ text: `User: ${message}` });

    const result = await model.generateContent(inputParts);
    const response = await result.response;
    const text = response.text();

    console.log(result, "result");

    res.json({
      success: true,
      response: text,
    });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate AI response",
      details: error.message,
    });
  }
});


module.exports = router;
