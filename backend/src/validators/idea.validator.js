const { body, param, query } = require("express-validator");

const ideaValidators = {
  createIdea: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters")
      .escape(),

    body("details")
      .trim()
      .notEmpty()
      .withMessage("Details are required")
      .isLength({ min: 10, max: 2000 })
      .withMessage("Details must be between 10 and 2000 characters")
      .escape(),

    body("category")
      .optional()
      .trim()
      .isIn(["tech", "business", "social", "creative", "other"])
      .withMessage(
        "Category must be one of: tech, business, social, creative, other",
      ),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array")
      .custom((tags) => {
        if (!Array.isArray(tags)) return true;
        if (tags.length > 10) {
          throw new Error("Maximum 10 tags allowed");
        }
        return tags.every(
          (tag) =>
            typeof tag === "string" &&
            tag.trim().length > 0 &&
            tag.trim().length <= 30,
        );
      })
      .withMessage("Each tag must be a non-empty string (max 30 characters)"),

    body("isPublic")
      .optional()
      .isBoolean()
      .withMessage("isPublic must be a boolean"),
  ],

  updateIdea: [
    param("id").isMongoId().withMessage("Invalid idea ID format"),

    body("title")
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters")
      .escape(),

    body("details")
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Details must be between 10 and 2000 characters")
      .escape(),

    body("category")
      .optional()
      .trim()
      .isIn(["tech", "business", "social", "creative", "other"])
      .withMessage(
        "Category must be one of: tech, business, social, creative, other",
      ),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array")
      .custom((tags) => {
        if (!Array.isArray(tags)) return true;
        if (tags.length > 10) {
          throw new Error("Maximum 10 tags allowed");
        }
        return tags.every(
          (tag) =>
            typeof tag === "string" &&
            tag.trim().length > 0 &&
            tag.trim().length <= 30,
        );
      })
      .withMessage("Each tag must be a non-empty string (max 30 characters)"),

    body("isPublic")
      .optional()
      .isBoolean()
      .withMessage("isPublic must be a boolean"),

    body("status")
      .optional()
      .isIn(["draft", "pending", "approved", "rejected"])
      .withMessage("Status must be one of: draft, pending, approved, rejected"),
  ],

  getIdeaById: [param("id").isMongoId().withMessage("Invalid idea ID format")],

  deleteIdea: [param("id").isMongoId().withMessage("Invalid idea ID format")],

  getAllIdeas: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .toInt(),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100")
      .toInt(),

    query("search")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Search term must be at least 2 characters")
      .escape(),

    query("status")
      .optional()
      .isIn(["draft", "pending", "approved", "rejected"])
      .withMessage("Status must be one of: draft, pending, approved, rejected"),

    query("category")
      .optional()
      .isIn(["tech", "business", "social", "creative", "other"])
      .withMessage(
        "Category must be one of: tech, business, social, creative, other",
      ),

    query("sort")
      .optional()
      .isIn(["createdAt", "-createdAt", "views", "-views", "title", "-title"])
      .withMessage("Invalid sort field"),
  ],

  getMyIdeas: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .toInt(),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100")
      .toInt(),

    query("status")
      .optional()
      .isIn(["draft", "pending", "approved", "rejected"])
      .withMessage("Status must be one of: draft, pending, approved, rejected"),
  ],

  likeIdea: [param("id").isMongoId().withMessage("Invalid idea ID format")],

  unlikeIdea: [param("id").isMongoId().withMessage("Invalid idea ID format")],

  addComment: [
    param("id").isMongoId().withMessage("Invalid idea ID format"),

    body("text")
      .trim()
      .notEmpty()
      .withMessage("Comment text is required")
      .isLength({ min: 1, max: 500 })
      .withMessage("Comment must be between 1 and 500 characters")
      .escape(),
  ],

  deleteComment: [
    param("id").isMongoId().withMessage("Invalid idea ID format"),

    param("commentId").isMongoId().withMessage("Invalid comment ID format"),
  ],

  bulkDelete: [
    body("ids")
      .isArray()
      .withMessage("ids must be an array")
      .custom((ids) => {
        if (!Array.isArray(ids)) return true;
        if (ids.length === 0) {
          throw new Error("At least one idea ID is required");
        }
        if (ids.length > 50) {
          throw new Error("Maximum 50 ideas can be deleted at once");
        }
        return ids.every(
          (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id),
        );
      })
      .withMessage("Each ID must be a valid MongoID"),
  ],

  searchIdeas: [
    query("q")
      .trim()
      .notEmpty()
      .withMessage("Search query is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Search query must be between 2 and 100 characters")
      .escape(),

    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .toInt(),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50")
      .toInt(),
  ],

  // ============================================================
  // BULK UPDATE VALIDATION
  // ============================================================
  bulkUpdate: [
    body("ids")
      .isArray()
      .withMessage("ids must be an array")
      .custom((ids) => {
        if (!Array.isArray(ids)) return true;
        if (ids.length === 0) {
          throw new Error("At least one idea ID is required");
        }
        if (ids.length > 50) {
          throw new Error("Maximum 50 ideas can be updated at once");
        }
        return ids.every(
          (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id),
        );
      })
      .withMessage("Each ID must be a valid MongoID"),

    body("data")
      .isObject()
      .withMessage("Update data must be an object")
      .custom((data) => {
        const allowedFields = ["status", "category", "isPublic", "tags"];
        const invalidFields = Object.keys(data).filter(
          (key) => !allowedFields.includes(key),
        );
        if (invalidFields.length > 0) {
          throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
        }
        return true;
      }),
  ],
};

module.exports = ideaValidators;
