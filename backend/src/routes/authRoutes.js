const express = require("express");
const passport = require("passport");
const { rateLimit } = require("express-rate-limit");
const { authenticateJwt } = require("../controllers/middlewares");
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  googleCallback,
  facebookCallback,
} = require("../controllers/user.controller");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many password reset attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refreshToken);
router.post("/forgot-password", passwordLimiter, forgotPassword);
router.post("/reset-password", passwordLimiter, resetPassword);
router.get("/verify-email", verifyEmail);
// Protected routes
router.use(authenticateJwt);
router.post("/logout", logout);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/change-password", changePassword);

module.exports = router;

// OAuth routes
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] }),
// );
// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   googleCallback,
// );
// router.get(
//   "/auth/facebook",
//   passport.authenticate("facebook", { scope: ["email"] }),
// );
// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { session: false }),
//   facebookCallback,
// );
