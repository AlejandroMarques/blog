const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
    throw new Error("Database connection failed");
  }
};

module.exports = {
  connection,
};
