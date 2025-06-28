const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_PUBLIC_KEY);
console.log(genAI, "genAIsssssssssssssssssss");

// Generate AI response endpoint
router.post("/generate-ai-response", async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;
    console.log(message, "messagey");
    console.log(chatHistory, "chatHistory");
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // For text-only input, use the gemini-pro model
    // After (Recommended Fix)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",  
    });
    // Format the chat history for the model
    const formattedHistory = chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Start a chat session with the model
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Send the message and get the response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

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
