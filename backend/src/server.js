const { setupPassport } = require("./config/passport");
const { setupExceptionHandlers } = require("./config/exceptionHandler");
const { connectDB } = require("./config/db");
const { buildApp } = require("./config/express");
const config = require("./config/environments");
const { logger } = require("./config/winston");

setupPassport();
setupExceptionHandlers();

connectDB();

const app = buildApp();

const server = app.listen(config.server.port, () => {
  logger.info(`Server running on port ${config.server.port}`);
  console.log("server is running");
  logger.info(`Environment: ${config.server.nodeEnv}`);
  logger.info(`API: http://localhost:${config.server.port}/api`);
});

global.server = server;

const shutdown = async () => {
  logger.info(" Shutting down gracefully...");
  server.close(() => {
    logger.info(" HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

module.exports = app;
