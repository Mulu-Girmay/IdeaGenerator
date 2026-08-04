class APPError extends Error {
  constructor(message, options = {}) {
    super(message);

    this.name = this.constructor.name;
    this.isOperational = options.isOperational || true;
    this.statusCode = options.statusCode || 500;
    this.status = options.status || "error";
    this.details = options.details || null;
    this.isPublic = options.isPublic || false;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      details: this.details,
      isPublic: this.isPublic,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}

module.exports = APPError;
