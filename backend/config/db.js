const mongoose = require("mongoose");

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed");
    console.log(error.message);
    throw error;
  }
}

module.exports = connectDB;