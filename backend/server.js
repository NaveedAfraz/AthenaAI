const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3006;
app.use(express.json());
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.get("/", (req, res) => {
  res.send("hello world");
});

const imgUploadRouter = require("./routes/imgupload");
const chatRouter = require("./routes/chat");

const { config } = require("process");

app.use("/api", imgUploadRouter);
app.use("/api", chatRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
