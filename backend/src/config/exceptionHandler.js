const { logger } = require("./winston");

const logError = (type, error, context = {}) => {
  logger.error(`💥 ${type}:`, {
    error: error.message,
    stack: error.stack,
    ...context,
  });
};

const gracefulShutdown = (reason) => {
  logger.warn(`🔄 Graceful shutdown: ${reason}`);
  if (global.server) {
    global.server.close(() => {
      process.exit(1);
    });
    setTimeout(() => process.exit(1), 5000);
  } else {
    process.exit(1);
  }
};

const setupExceptionHandlers = () => {
  process.on("uncaughtException", (error) => {
    logError("Uncaught Exception", error);
    gracefulShutdown("Uncaught Exception");
  });

  process.on("unhandledRejection", (reason) => {
    logError("Unhandled Rejection", reason);
    gracefulShutdown("Unhandled Rejection");
  });

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  console.log("✅ Exception handlers configured");
};

module.exports = { setupExceptionHandlers };
