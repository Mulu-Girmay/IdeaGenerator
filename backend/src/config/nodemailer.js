const nodemailer = require("nodemailer");
const config = require("./environments");
const { logger } = require("./winston");

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

let transporter = null;

const createTransporter = () => {
  if (transporter) return transporter;

  if (!config.email.host) {
    logger.warn("Email not configured - using mock transporter");
    transporter = {
      sendMail: async (mailOptions) => {
        logger.info("📧 Mock email sent:", {
          to: mailOptions.to,
          subject: mailOptions.subject,
        });
        return { messageId: "mock-" + Date.now() };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  transporter.verify((error) => {
    if (error) {
      logger.error("Email transporter error:", error);
    } else {
      logger.info(" Email transporter ready");
    }
  });

  return transporter;
};

const sendEmail = async (to, subject, html, text = "", attempt = 1) => {
  try {
    const mailer = createTransporter();
    const mailOptions = {
      from: config.email.from || "noreply@ideatracker.com",
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    };

    const result = await mailer.sendMail(mailOptions);
    logger.info(` Email sent to ${to}`, { subject, messageId: result.messageId });
    return result;
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      logger.warn(`Email failed (attempt ${attempt}), retrying in ${RETRY_DELAY_MS}ms...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return sendEmail(to, subject, html, text, attempt + 1);
    }
    logger.error(` Email sending failed after ${MAX_RETRIES} attempts:`, error);
    throw error;
  }
};

module.exports = { createTransporter, sendEmail };
