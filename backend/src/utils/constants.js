module.exports = {
  MODELS: {
    USER: "User",
    IDEA: "Idea",
  },

  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  ROLES: {
    USER: "user",
    ADMIN: "admin",
  },

  STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500,
  },

  EVENTS: {
    USER_REGISTERED: "user:registered",
    USER_EMAIL_VERIFIED: "user:emailVerified",
    USER_PASSWORD_RESET: "user:passwordReset",
    USER_LOGIN: "user:login",
    USER_LOGOUT: "user:logout",
    IDEA_CREATED: "idea:created",
    IDEA_DELETED: "idea:deleted",
  },
};
