const { validationResult } = require("express-validator");
const { ValidationError } = require("../error/ApiErrors");

const parseValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    throw new ValidationError("Validation failed", errorMessages);
  }

  next();
};

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    next(new ValidationError("Validation failed", errorMessages));
  };
};

module.exports = {
  parseValidationErrors,
  validate,
};
