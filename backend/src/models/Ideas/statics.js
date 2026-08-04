const statics = {
  createIdea: async function (data) {
    const idea = new this({
      ...data,
      createdBy: data.owner.toString(),
    });
    await idea.save();
    return idea;
  },

  getByOwner: async function (ownerId, options = {}) {
    const { page = 1, limit = 10, status = null } = options;
    const skip = (page - 1) * limit;

    const filter = { owner: ownerId };
    if (status) filter.status = status;

    const [ideas, total] = await Promise.all([
      this.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.countDocuments(filter),
    ]);

    return {
      ideas,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  getAllWithFilters: async function (filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = "-createdAt" } = options;
    const skip = (page - 1) * limit;

    const query = { ...filters };

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const [ideas, total] = await Promise.all([
      this.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("owner", "username email profile")
        .lean(),
      this.countDocuments(query),
    ]);

    return {
      ideas,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  getPublic: async function (options = {}) {
    return this.getAllWithFilters({ isPublic: true }, options);
  },

  search: async function (query, options = {}) {
    return this.getAllWithFilters({ search: query }, options);
  },

  deleteByOwner: async function (ownerId) {
    const result = await this.deleteMany({ owner: ownerId });
    return result;
  },
};

module.exports = statics;
