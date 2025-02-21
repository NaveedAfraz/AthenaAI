const express = require("express");
const router = express.Router();

const pool = require("../db");
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_PUBLIC_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
router.post("/add-chat", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(404).json({ message: "UserId is missing" });
  }
  try {
    const query =
      `INSERT INTO Conversations (Title, created_at, userID)` +
      `VALUES (?, ?,?)`;
    const values = ["new conversation", new Date(), userId];

    const [data] = await pool.execute(query, values);
    // console.log(data);
    return res
      .status(200)
      .json({ message: "Conversation created", conversationId: data.insertId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/send-message", async (req, res) => {
  const { conversationId, question, answer, image } = req.body;
  console.log(conversationId, question, answer, image);

  try {
    if (!conversationId || !question || !answer)
      return res.status(400).json({ message: "something is missing" });

    const query1 = `SELECT * FROM messages WHERE conversationID = ?`;
    const [data1] = await pool.execute(query1, [conversationId]);
    console.log("data of chat is ", data1);

    if (data1.length == 0) {
      const query2 = `UPDATE Conversations set Title = ? where ConversationsID = ?`;
      const values = [question, conversationId];
      const [data2] = await pool.execute(query2, values);
      console.log("titl of chat is :", data2);
    }

    let query3;
    let values;
    if (Object.keys(image).length !== 0) {
      console.log("runnnnnnnnnnnnnnnnnnnnn");

      query3 =
        `INSERT INTO messages (conversationID, question, answer ,image)` +
        `VALUES (?, ?, ?,?)`;
      values = [conversationId, question, answer, image];
    } else {
      query3 =
        `INSERT INTO messages (conversationID, question, answer)` +
        `VALUES (?, ?, ?)`;
      values = [conversationId, question, answer];
    }

    const [data] = await pool.execute(query3, values);
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
  // console.log(conversationId, "this is the converstion id ");
  try {
    if (!conversationId)
      return res.status(400).json({ message: "something is missing" });

    const query = `SELECT * FROM messages WHERE ConversationId = ?`;
    const [data] = await pool.execute(query, [conversationId]);
    //  console.log("data is this : ", data);
    if (data.length > 0) {
      return res.status(200).json({ data });
    }
    return res
      .status(404)
      .json({ message: "Start a conversation with your personalised AI" });
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
    const query = `SELECT * FROM Conversations WHERE UserId = ?`;
    // console.log(query);
    const [data] = await pool.execute(query, [userId]);
    //  console.log(data, "data is here");
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
