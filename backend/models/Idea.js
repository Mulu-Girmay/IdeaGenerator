const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  details: { type: String },
});

module.exports = mongoose.model("Idea", IdeaSchema);
