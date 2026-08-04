const express = require("express");
const userRoutes = require("../routes/authRoutes");
const ideaRoutes = require("../routes/ideaRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/ideas", ideaRoutes);

router.get("/", (req, res) => {
  res.json({
    name: "Idea Tracker API",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/users/register",
        login: "POST /api/users/login",
        profile: "GET /api/users/profile",
      },
      ideas: {
        create: "POST /api/ideas",
        getAll: "GET /api/ideas",
        getById: "GET /api/ideas/:id",
        update: "PATCH /api/ideas/:id",
        delete: "DELETE /api/ideas/:id",
        like: "POST /api/ideas/:id/like",
        unlike: "DELETE /api/ideas/:id/unlike",
        comment: "POST /api/ideas/:id/comments",
      },
    },
  });
});

module.exports = router;
