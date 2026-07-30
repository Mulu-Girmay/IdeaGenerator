const { TokenExpiredError } = require("jsonwebtoken");
const mongoose = require("mongoose");

const connectDb = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDb connected");
  } catch (error) {
    console.log("db not conncted", error.message);
  }
};
module.exports = { connectDb };
