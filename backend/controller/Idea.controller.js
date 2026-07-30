const Idea = require("../models/Idea.js");

const createIdea = async (req, res) => {
  const { title, details } = req.body;
  const newIdea = await Idea.create({
    title: title,
    details: details,
  });
  return res.status(200).json(newIdea);
};
const getIdeas = async (req, res) => {
  const ideas = await Idea.find();
  if (!ideas) {
    return res.status(400).json({ message: "No Ideas Found" });
  }
  return res.status(200).json(ideas);
};
const updateIdea = async (req, res) => {
  const updated = req.body;
  const id = req.params.id;
  const updatedIdea = await Idea.findByIdAndUpdate(id, updated, {
    new: true,
    runValidators: true,
  });
  if (!updatedIdea) {
    return res.status(400).json({ message: "No Ideas Found" });
  }
  return res.status(200).json(updatedIdea);
};
const deleteIdea = async (req, res) => {
  const id = req.params.id;
  const idea = await Idea.findByIdAndDelete(id);
  if (!idea) {
    return res.status(400).json({ message: "No Ideas Found" });
  }
  return res.status(200).json(idea);
};

module.exports = { deleteIdea, createIdea, getIdeas, updateIdea };
