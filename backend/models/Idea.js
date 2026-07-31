const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    details: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Idea", IdeaSchema);
