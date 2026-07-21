const Idea = require("../models/Idea.js");

const createIdea = (req, res) => {
  const { title, details } = req.body;
  const newIdea = Idea.create({
    title: title,
    details: details,
  });
  return res.status(200).json(newIdea);
};
const getIdeas = (req, res) => {
  const ideas = Idea.find();
  if (!ideas) {
    return res.status(400).json({ message: "No Ideas Found" });
  }
  return res.status(200).json(ideas);
};
const updateIdea = (req, res) => {
  const updated = req.body;
  const id = req.params.id;
  const updatedIdea = Idea.findByIdAndUpdate(
    { id, update },
    { new: true },
    { runValidators: true },
  );
  if (!updatedIdea) {
    return res.status(400).json({ message: "No Ideas Found" });
  }
  return res.status(200).json(updatedIdea);
};
const deleteIdea = (req, res) => {
  const id = req.params.id;
  const idea = Idea.findByIdAndDelete({ id });
  if (!idea) {
    return res.status(400).json({ message: "No Ideas Found" });
  }
  return res.status(200).json(idea);
};

module.exports = { deleteIdea, createIdea, getIdeas, updateIdea };
