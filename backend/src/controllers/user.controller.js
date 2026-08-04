const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/users");
const events = require("../config/Events");
const { logger } = require("../config/winston");
const { STATUS, EVENTS } = require("../utils/constants");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.createUser({ username, email, password });

    events.emit(EVENTS.USER_REGISTERED, user);

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json({
      success: true,
      user: user.getPublicProfile(),
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.status(STATUS.UNAUTHORIZED).json({
          success: false,
          message: info?.message || "Invalid credentials",
        });
      }

      try {
        const token = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        await user.updateLastLogin();
        events.emit(EVENTS.USER_LOGIN, user, req.ip);

        res.json({
          success: true,
          user: user.getPublicProfile(),
          token,
          refreshToken,
        });
      } catch (error) {
        next(error);
      }
    },
  )(req, res, next);
};

const logout = async (req, res) => {
  events.emit(EVENTS.USER_LOGOUT, req.user);
  res.json({ success: true, message: "Logged out successfully" });
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ success: true, user: user.getPublicProfile() });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.updateUser(req.userId, req.body);
    res.json({ success: true, user: user.getPublicProfile() });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    if (user.verifyEmail(token)) {
      await user.save();
      events.emit(EVENTS.USER_EMAIL_VERIFIED, user);
      res.json({ success: true, message: "Email verified successfully" });
    } else {
      res.status(STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(STATUS.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.resetPassword(token, newPassword);

    events.emit(EVENTS.USER_PASSWORD_RESET, user);

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const token = user.generateAuthToken();
    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

// const googleCallback = (req, res) => {
//   const token = req.user.generateAuthToken();
//   res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
// };

// const facebookCallback = (req, res) => {
//   const token = req.user.generateAuthToken();
//   res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
// };

module.exports = {
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
};
