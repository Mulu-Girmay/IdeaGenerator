const passport = require("passport");
const { logger } = require("../config/winston");
const { ROLES, STATUS } = require("../utils/constants");

// Authentication middleware using Passport JWT
const authenticateJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      logger.error("Authentication error:", err);
      return res.status(STATUS.INTERNAL_SERVER).json({ message: "Authentication failed" });
    }

    if (!user) {
      return res.status(STATUS.UNAUTHORIZED).json({
        message: info?.message || "Authentication required",
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  })(req, res, next);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    user: req.user?.id,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};

// Ownership check middleware
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);

      if (!resource) {
        return res.status(STATUS.NOT_FOUND).json({ message: "Resource not found" });
      }

      if (resource.owner.toString() !== req.userId.toString()) {
        return res.status(STATUS.FORBIDDEN).json({
          message: "You are not authorized to modify this resource",
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authenticateJwt,
  errorHandler,
  notFound,
  checkOwnership,
};
