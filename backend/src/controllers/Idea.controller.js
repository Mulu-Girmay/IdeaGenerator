const Idea = require("../models/Ideas");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} = require("../error/ApiErrors");
const { ROLES } = require("../utils/constants");

const createIdea = async (req, res, next) => {
  try {
    const { title, details, category, tags, isPublic } = req.body;

    if (!title?.trim() || !details?.trim()) {
      throw new BadRequestError("Title and details are required");
    }

    const existing = await Idea.findOne({
      title: title.trim(),
      owner: req.userId,
    });
    if (existing) {
      throw new ConflictError("You already have an idea with this title");
    }

    const idea = await Idea.createIdea({
      title: title.trim(),
      details: details.trim(),
      owner: req.userId,
      category: category || "other",
      tags: tags || [],
      isPublic: isPublic || false,
    });

    res.status(201).json({
      success: true,
      idea: idea.getPublicData(),
    });
  } catch (error) {
    next(error);
  }
};

const getMyIdeas = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const result = await Idea.getByOwner(req.userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllIdeas = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, category } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;

    if (req.user.role !== ROLES.ADMIN) {
      filters.isPublic = true;
    }

    const result = await Idea.getAllWithFilters(filters, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getIdeaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findById(id)
      .populate("owner", "username email profile")
      .populate("comments.user", "username profile");

    if (!idea) {
      throw new NotFoundError("Idea not found");
    }

    if (
      !idea.isPublic &&
      !idea.isOwner(req.userId) &&
      req.user.role !== ROLES.ADMIN
    ) {
      throw new ForbiddenError("You do not have access to this idea");
    }

    if (idea.isPublic) {
      await idea.incrementViews();
    }

    res.json({
      success: true,
      idea: idea.getPublicData(),
    });
  } catch (error) {
    next(error);
  }
};

const updateIdea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, details, category, tags, isPublic, status } = req.body;

    const idea = await Idea.findById(id);
    if (!idea) {
      throw new NotFoundError("Idea not found");
    }

    if (!idea.isOwner(req.userId)) {
      throw new ForbiddenError(
        "You do not have permission to update this idea",
      );
    }

    if (title !== undefined) idea.title = title.trim();
    if (details !== undefined) idea.details = details.trim();
    if (category !== undefined) idea.category = category;
    if (tags !== undefined) idea.tags = tags;
    if (isPublic !== undefined) idea.isPublic = isPublic;
    if (status !== undefined && req.user.role === ROLES.ADMIN) {
      idea.status = status;
    }

    await idea.save();

    res.json({
      success: true,
      idea: idea.getPublicData(),
    });
  } catch (error) {
    next(error);
  }
};

const deleteIdea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findById(id);

    if (!idea) {
      throw new NotFoundError("Idea not found");
    }

    if (!idea.isOwner(req.userId) && req.user.role !== ROLES.ADMIN) {
      throw new ForbiddenError(
        "You do not have permission to delete this idea",
      );
    }

    await idea.deleteOne();

    res.json({
      success: true,
      message: "Idea deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const likeIdea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findById(id);

    if (!idea) {
      throw new NotFoundError("Idea not found");
    }

    await idea.addLike(req.userId);

    res.json({
      success: true,
      likes: idea.likeCount,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UNLIKE IDEA
// ============================================================
const unlikeIdea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findById(id);

    if (!idea) {
      throw new NotFoundError("Idea not found");
    }

    await idea.removeLike(req.userId);

    res.json({
      success: true,
      likes: idea.likeCount,
    });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      throw new BadRequestError("Comment text is required");
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      throw new NotFoundError("Idea not found");
    }

    const comment = await idea.addComment(req.userId, text.trim());

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const idea = await Idea.findById(id);

    if (!idea) {
      throw new NotFoundError("Idea not found");
    }

    const commentIndex = idea.comments.findIndex(
      (c) => c._id.toString() === commentId,
    );

    if (commentIndex === -1) {
      throw new NotFoundError("Comment not found");
    }

    const comment = idea.comments[commentIndex];
    if (
      comment.user.toString() !== req.userId.toString() &&
      req.user.role !== ROLES.ADMIN
    ) {
      throw new ForbiddenError(
        "You do not have permission to delete this comment",
      );
    }

    idea.comments.splice(commentIndex, 1);
    await idea.save();

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
