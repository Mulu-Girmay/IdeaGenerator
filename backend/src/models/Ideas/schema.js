const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      index: true,
    },
    details: {
      type: String,
      required: [true, "Details are required"],
      trim: true,
      maxlength: [2000, "Details cannot exceed 2000 characters"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["tech", "business", "social", "creative", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "pending",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

IdeaSchema.index({ title: "text", details: "text" });
IdeaSchema.index({ owner: 1, createdAt: -1 });

IdeaSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

IdeaSchema.virtual("commentCount").get(function () {
  return this.comments?.length || 0;
});

IdeaSchema.pre("save", function (next) {
  if (!this.createdBy) {
    this.createdBy = this.owner.toString();
  }
  next();
});

module.exports = IdeaSchema;
