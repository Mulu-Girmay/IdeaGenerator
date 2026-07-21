const User = require("../models/User");
require("dotenv").config();

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expirein: "15m",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = jwt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const generatedToken = generateToken(user._id);
  return res.status(200).json({ email: user.email, token: generatedToken });
};
module.exports = { loginUser };
