const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../../config/environments");

const methods = {
  comparePassword: async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },

  generateAuthToken: function () {
    return jwt.sign(
      { userId: this._id, email: this.email, role: this.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );
  },

  generateRefreshToken: function () {
    return jwt.sign({ userId: this._id }, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
  },

  generatePasswordResetToken: function () {
    // Invalidate any existing token before generating a new one
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  },

  verifyEmail: function (token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (
      this.emailVerificationToken === hashedToken &&
      this.emailVerificationExpires > Date.now()
    ) {
      this.isEmailVerified = true;
      this.emailVerificationToken = undefined;
      this.emailVerificationExpires = undefined;
      return true;
    }
    return false;
  },

  getPublicProfile: function () {
    const user = this.toObject();
    const sensitive = [
      "password",
      "emailVerificationToken",
      "resetPasswordToken",
      "resetPasswordExpires",
      "loginAttempts",
      "lockUntil",
      "__v",
    ];
    sensitive.forEach((field) => delete user[field]);
    return user;
  },

  updateLastLogin: async function () {
    this.lastLogin = Date.now();
    await this.save();
  },
};

module.exports = methods;
