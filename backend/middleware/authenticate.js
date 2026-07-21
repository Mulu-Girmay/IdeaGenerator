const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ messsage: "token Not Found" });
  }
  const token = authHeader.split(" ").authHeader[1];
  const Decode = jwt.verify(token, Process.env.JWT_SECRET);
  req.user = Decode.userId;
  return token;
};

module.exports = { authenticate };
