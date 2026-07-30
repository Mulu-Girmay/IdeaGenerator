require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ideaRoutes = require("./routes/ideaRoutes");
const authRoutes = require("./routes/authRoutes");
const { connectDb } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);

app.get("/", (req, res) => {
  res.send("Idea Tracker API is running");
});

app.listen(PORT, async () => {
  await connectDb(MONGO_URI);
  console.log(`Server running on port ${PORT}`);
});

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err.message);
//   })
//   .finally(() => {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   });
