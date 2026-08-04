const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../../models/users");

module.exports = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) return done(null, false, { message: "Invalid email or password" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: "Invalid email or password" });

      if (!user.isActive) return done(null, false, { message: "Account is deactivated" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);
