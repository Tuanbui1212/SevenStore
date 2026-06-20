const mongoose = require("mongoose");
const ensureAdmin = require("../ensureAdmin");

async function connect() {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1/SevenStore";

  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Kết nối MongoDB thành công");
    await ensureAdmin();
  } catch (error) {
    console.error("❌ Kết nối MongoDB thất bại:", error.message);
  }
}

module.exports = { connect };
