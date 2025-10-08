const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Account = new Schema(
  {
    name: { type: String, maxLength: 255, required: true, trim: true },
    user: { type: String, maxLength: 255, required: true, trim: true },
    password: { type: Number, required: true, trim: true },
    role: { type: String, maxLength: 255, required: true, trim: true },
    cart: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("account", Account);
