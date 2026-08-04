const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../../models/users");
const config = require("../environments");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

module.exports = new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});
