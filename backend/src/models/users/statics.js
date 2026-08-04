const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const statics = {
  createUser: async function (userData) {
    const user = new this(userData);
    await user.save();
    return user;
  },

  // Authenticate user
  authenticateUser: async function (email, password) {
    const user = await this.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    return user;
  },

  // Find by email
  findByEmail: async function (email) {
    return this.findOne({ email });
  },

  // Update user
  updateUser: async function (userId, updateData) {
    const allowed = ["username", "email", "profile", "preferences"];
    const filtered = {};
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        filtered[key] = updateData[key];
      }
    }
    const user = await this.findByIdAndUpdate(userId, filtered, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new Error("User not found");
    return user;
  },

  // Reset password
  resetPassword: async function (token, newPassword) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await this.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Invalid or expired reset token");
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return user;
  },
};

module.exports = statics;
