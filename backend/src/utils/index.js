const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/environments");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(config.auth.saltRounds);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

const generateActivationUrl = (token) => {
  return `${config.client.url}/verify-email?token=${token}`;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateActivationUrl,
};
