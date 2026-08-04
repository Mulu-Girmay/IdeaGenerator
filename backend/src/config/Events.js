const EventEmitter = require("events");
const { sendEmail } = require("./nodemailer");
const { logger } = require("./winston");
const { compileTemplate } = require("../utils/mailTemplats");
const { EVENTS } = require("../utils/constants");

class AppEvents extends EventEmitter {
  constructor() {
    super();
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.on(EVENTS.USER_REGISTERED, async (user) => {
      logger.info(`User registered: ${user.email}`);
      try {
        await this.sendVerificationEmail(user);
      } catch (error) {
        logger.error("Failed to send verification email:", error);
      }
    });

    // Email verification
    this.on(EVENTS.USER_EMAIL_VERIFIED, async (user) => {
      logger.info(` Email verified: ${user.email}`);
    });

    this.on(EVENTS.USER_PASSWORD_RESET, async (user) => {
      logger.info(` Password reset for: ${user.email}`);
      await this.sendPasswordResetConfirmation(user);
    });

    // User login
    this.on(EVENTS.USER_LOGIN, (user, ip) => {
      logger.info(` User logged in: ${user.email}`, { ip });
    });

    // User logout
    this.on(EVENTS.USER_LOGOUT, (user) => {
      logger.info(`User logged out: ${user.email}`);
    });

    // Idea created
    this.on(EVENTS.IDEA_CREATED, (idea, user) => {
      logger.info(`New idea created: ${idea.title} by ${user.email}`);
    });

    // Idea deleted
    this.on(EVENTS.IDEA_DELETED, (idea, user) => {
      logger.info(` Idea deleted: ${idea.title} by ${user.email}`);
    });

    // Error events
    this.on("error", (error, context) => {
      logger.error(" Event error:", { error: error.message, context });
    });
  }

  async sendVerificationEmail(user) {
    const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/verify-email?token=${user.emailVerificationToken}`;

    const html = compileTemplate({
      title: "Welcome to Idea Tracker!",
      username: user.username,
      description: "Please verify your email address by clicking the button below:",
      link: verificationUrl,
      buttonText: "Verify Email",
      additionalInfo: "This link will expire in 24 hours.",
    });

    await sendEmail(user.email, "Verify Your Email", html);
  }

  async sendPasswordResetConfirmation(user) {
    const html = compileTemplate({
      title: "Password Reset Successful",
      username: user.username,
      description: "Your password has been successfully reset.",
      link: "",
      buttonText: "",
      additionalInfo: "If you didn't request this change, please contact support immediately.",
    });

    await sendEmail(user.email, "Password Reset Confirmation", html);
  }
}

module.exports = new AppEvents();
