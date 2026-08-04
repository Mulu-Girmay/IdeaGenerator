const passport = require("passport");
const localStrategy = require("./localStrategy");
const jwtStrategy = require("./jwtStrategy");

const setupPassport = () => {
  passport.use(localStrategy);
  passport.use(jwtStrategy);
};

module.exports = { setupPassport };
