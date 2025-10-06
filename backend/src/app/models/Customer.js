const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Customer = new Schema(
  {
    name: { type: String, maxLength: 255, required: true, trim: true },
    status: { type: String, maxLength: 255, required: true, trim: true },
    phone: { type: Number, required: true, trim: true },
    address: { type: String, maxLength: 255, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("customer", Customer);
