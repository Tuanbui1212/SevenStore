const mongoose = require("mongoose");

async function connect() {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1/SevenStore";

  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Kết nối MongoDB thành công");
  } catch (error) {
    console.error("❌ Kết nối MongoDB thất bại:", error.message);
  }
}

module.exports = { connect };
