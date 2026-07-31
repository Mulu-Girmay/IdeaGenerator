const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};
const loginUser = async (req, res) => {
  console.log("📨 Login request received");
  console.log("📦 Request body:", req.body); // Check if body is empty

  try {
    const { email, password } = req.body;
    console.log("📧 Email:", email);

    if (!email || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({ message: "Email and password required" });
    }

    console.log("🔍 Looking for user...");
    const user = await User.findOne({ email: email });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🔐 Checking password...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("🎫 Generating token...");
    const token = generateToken(user._id);
    console.log("✅ Login successful");

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("💥 Login error:", error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { loginUser };
