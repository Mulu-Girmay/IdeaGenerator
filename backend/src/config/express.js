const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const helmet = require("helmet");
const { logger, stream } = require("./winston");
const config = require("./environments");
const routes = require("./routes");
const { setupPassport } = require("./passport");
const { errorHandler, notFound } = require("../controllers/middlewares");

const buildApp = () => {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
    }),
  );

  app.use(morgan("combined", { stream }));

  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  app.use(passport.initialize());

  app.use((req, res, next) => {
    logger.debug(` ${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next();
  });

  app.use("/api", routes);

  app.get("/health", (req, res) => {
    res.json({
      status: "UP",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.use(notFound);

  app.use(errorHandler);

  return app;
};

module.exports = { buildApp };
