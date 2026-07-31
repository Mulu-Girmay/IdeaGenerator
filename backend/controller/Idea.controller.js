const mongoose = require("mongoose");
const Idea = require("../models/Idea.js");

const createIdea = async (req, res) => {
  try {
    const { title, details } = req.body;

    if (!title || !title.trim() || !details || !details.trim()) {
      return res
        .status(400)
        .json({ message: "Title and details are required" });
    }

    const newIdea = await Idea.create({
      title: title.trim(),
      details: details.trim(),
      owner: req.user,
    });
    return res.status(201).json(newIdea);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "An idea with this title already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to create idea" });
  }
};

const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    return res.status(200).json(ideas);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ideas" });
  }
};

const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, details } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    const update = {};
    if (title !== undefined) update.title = title.trim();
    if (details !== undefined) update.details = details.trim();

    const updatedIdea = await Idea.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedIdea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    return res.status(200).json(updatedIdea);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "An idea with this title already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to update idea" });
  }
};

const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    const idea = await Idea.findByIdAndDelete(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    return res.status(200).json(idea);
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete idea" });
  }
};

module.exports = { deleteIdea, createIdea, getIdeas, updateIdea };
