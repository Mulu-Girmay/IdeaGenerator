require("dotenv").config();
const express = require("express");
const cors = require("cors");
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
app.get("/", (req, res) => res.send("Idea Tracker API is running"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

connectDb(MONGO_URI);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
