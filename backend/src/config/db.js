const mongoose = require("mongoose");
const config = require("./environments");
const { logger } = require("./winston");

let isConnected = false;
const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

const connectDB = async (retries = 0) => {
  if (isConnected) {
    logger.info("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(config.database.uri, {
      dbName: config.database.dbName,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    logger.info(" MongoDB connected successfully");

    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected — attempting reconnect...");
      isConnected = false;
      setTimeout(() => connectDB(), RETRY_INTERVAL_MS);
    });
  } catch (error) {
    logger.error(` MongoDB connection failed (attempt ${retries + 1}):`, error.message);
    if (retries < MAX_RETRIES) {
      logger.info(`Retrying in ${RETRY_INTERVAL_MS / 1000}s...`);
      setTimeout(() => connectDB(retries + 1), RETRY_INTERVAL_MS);
    } else {
      logger.error("Max retries reached. Exiting.");
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("MongoDB disconnected");
  }
};

module.exports = { connectDB, disconnectDB };
