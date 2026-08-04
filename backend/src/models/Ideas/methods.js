const methods = {
  addLike: async function (userId) {
    if (!this.likes.includes(userId)) {
      this.likes.push(userId);
      await this.save();
    }
    return this;
  },

  removeLike: async function (userId) {
    this.likes = this.likes.filter((id) => id.toString() !== userId.toString());
    await this.save();
    return this;
  },

  // Add comment
  addComment: async function (userId, text) {
    this.comments.push({ user: userId, text });
    await this.save();
    return this.comments[this.comments.length - 1];
  },

  // Increment views
  incrementViews: async function () {
    this.views += 1;
    await this.save();
    return this.views;
  },

  // Check ownership
  isOwner: function (userId) {
    return this.owner.toString() === userId.toString();
  },

  // Get public data
  getPublicData: function () {
    const data = this.toObject();
    delete data.__v;
    return data;
  },
};

module.exports = methods;
