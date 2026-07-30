const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ message: "Token Not Found" });
  }
  const token = authHeader.split(" ")[1];
  const Decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = Decode.userId;
  return token;
};

module.exports = { authenticate };
