const mongoose = require('mongoose');
require('dotenv').config();

const mongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
};

module.exports = { mongoDb };
