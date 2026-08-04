const express = require("express");
const { authenticateJwt } = require("../controllers/middlewares");
const { validate } = require("../validators");
const { ideaValidators } = require("../validators");
const {
  createIdea,
  getMyIdeas,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  likeIdea,
  unlikeIdea,
  addComment,
  deleteComment,
} = require("../controllers/Idea.controller");

const router = express.Router();

router.use(authenticateJwt);

router.post("/create", validate(ideaValidators.createIdea), createIdea);

router.get("/me", validate(ideaValidators.getMyIdeas), getMyIdeas);

router.get("/all", validate(ideaValidators.getAllIdeas), getAllIdeas);

router.get("/ideaById/:id", validate(ideaValidators.getIdeaById), getIdeaById);

router.patch("/update/:id", validate(ideaValidators.updateIdea), updateIdea);

router.delete("/delete/:id", validate(ideaValidators.deleteIdea), deleteIdea);

// Interactions
router.post("/:id/like", validate(ideaValidators.likeIdea), likeIdea);

router.delete("/:id/unlike", validate(ideaValidators.unlikeIdea), unlikeIdea);

router.post("/:id/comments", validate(ideaValidators.addComment), addComment);

router.delete(
  "/:id/comments/:commentId",
  validate(ideaValidators.deleteComment),
  deleteComment,
);

module.exports = router;
