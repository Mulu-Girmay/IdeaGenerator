const Joi = require("joi");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const envSchema = Joi.object({
  // Server
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  // Database
  MONGO_URI: Joi.string()
    .uri({ scheme: ["mongodb", "mongodb+srv"] })
    .required(),
  MONGO_DB_NAME: Joi.string().default("IdeaTracker"),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default("7d"),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("30d"),

  // Auth
  SALT_ROUNDS: Joi.number().default(10),

  // CORS
  CORS_ORIGIN: Joi.string().default("http://localhost:3000"),
  CORS_CREDENTIALS: Joi.boolean().default(true),

  // Frontend
  CLIENT_URL: Joi.string().uri().default("http://localhost:3000"),

  // Email
  EMAIL_HOST: Joi.string().optional(),
  EMAIL_PORT: Joi.number().optional(),
  EMAIL_USER: Joi.string().optional(),
  EMAIL_PASS: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().optional(),

  // OAuth
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  FACEBOOK_APP_ID: Joi.string().optional(),
  FACEBOOK_APP_SECRET: Joi.string().optional(),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid("error", "warn", "info", "debug")
    .default("info"),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  console.error("❌ Environment validation failed:");
  error.details.forEach((detail) => {
    console.error(`  - ${detail.message}`);
  });
  process.exit(1);
}

const config = {
  server: {
    port: envVars.PORT,
    nodeEnv: envVars.NODE_ENV,
    isDevelopment: envVars.NODE_ENV === "development",
    isProduction: envVars.NODE_ENV === "production",
  },
  database: {
    uri: envVars.MONGO_URI,
    dbName: envVars.MONGO_DB_NAME,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
  },
  auth: {
    saltRounds: envVars.SALT_ROUNDS,
  },
  cors: {
    origin: envVars.CORS_ORIGIN,
    credentials: envVars.CORS_CREDENTIALS,
  },
  client: {
    url: envVars.CLIENT_URL,
  },
  email: {
    host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS,
    from: envVars.EMAIL_FROM,
  },
  oauth: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      appId: envVars.FACEBOOK_APP_ID,
      appSecret: envVars.FACEBOOK_APP_SECRET,
    },
  },
  logging: {
    level: envVars.LOG_LEVEL,
  },
};

console.log("Environment validated successfully");
module.exports = config;
