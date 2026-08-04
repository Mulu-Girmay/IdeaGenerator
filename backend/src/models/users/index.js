const mongoose = require("mongoose");
const schema = require("./schema");
const methods = require("./methods");
const statics = require("./statics");

Object.keys(methods).forEach((key) => {
  schema.methods[key] = methods[key];
});

Object.keys(statics).forEach((key) => {
  schema.statics[key] = statics[key];
});

const User = mongoose.model("User", schema);

module.exports = User;
