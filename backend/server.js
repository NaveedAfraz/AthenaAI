const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3006;
const db = require("./db");
const path = require("path");
app.use(express.json());

const { requireAuth } = require("@clerk/express");

app.use(
  cors({
    origin: ["https://athena-ai-hljx.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const imgUploadRouter = require("./routes/imgupload");
const chatRouter = require("./routes/chat");
const aiRouter = require("./routes/ai");

const { config } = require("process");
app.use("/api/health", (req, res) => {
  return res.json({ message: "Server is running" });
});
app.use("/api", imgUploadRouter);
app.use("/api", chatRouter);
app.use("/api", aiRouter);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
