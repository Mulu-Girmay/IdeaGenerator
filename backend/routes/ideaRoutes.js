const express = require("express");
const router = express.Router();
const Idea = require("../models/Idea");
const {
  getIdeas,
  createIdea,
  deleteIdea,
  updateIdea,
} = require("../controller/Idea.controller");
const { authenticate } = require("../middleware/authenticate");

router.get("/allIdeas", authenticate, getIdeas);
router.post("/create", authenticate, createIdea);
router.patch("/update/:id", authenticate, updateIdea);
router.delete("/delete/:id", authenticate, deleteIdea);

module.exports = router;
