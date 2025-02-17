const express = require("express");
const router = express.Router();

const pool = require("../db");
router.post("/add-chat", async (req, res) => {
  try {
    const query =
      `INSERT INTO conversations (Title, CreatedAt)` + `VALUES (?, ?)`;
    const values = ["new conversation", new Date()];

    const [data] = await pool.execute(query, values);
    console.log(data);
    return res
      .status(200)
      .json({ message: "Conversation created", conversationId: data.insertId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/send-message", async (req, res) => {
  const { conversationId, question, answer } = req.body;

  try {
    if (!conversationId || !question || !answer)
      return res.status(400).json({ message: "something is missing" });

    const query =
      `INSERT INTO messages (ConversationId, Question, Answer)` +
      `VALUES (?, ?, ?)`;

    const values = [conversationId, question, answer];
    const [data] = await pool.execute(query, values);
    console.log(data);
    if (data.affectedRows === 1) {
      return res.status(200).json({ message: "Data inserted successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-conversation/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    if (!conversationId)
      return res.status(400).json({ message: "something is missing" });

    const query = `SELECT * FROM messages WHERE ConversationId = ?`;
    const [data] = await pool.execute(query, [conversationId]);
    console.log(data);
    if (data.length > 0) {
      return res.status(200).json({ data });
    }
    return res.status(404).json({ message: "No conversation found of thi id" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-chatList/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(404).json({ message: "userID is missing" });
  }
  try {
    const query = `SELECT * FROM conversations WHERE UserId = ?`;
    console.log(query);
    const [data] = await pool.execute(query, [userId]);
    console.log(data, "data is here");
    if (data.length === 0) {
      return res.status(404).json({ message: "No conversation found" });
    }
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
