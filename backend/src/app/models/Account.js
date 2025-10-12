const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Account = new Schema(
  {
    name: { type: String, maxLength: 255, required: true, trim: true },
    user: { type: String, maxLength: 255, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, maxLength: 255, required: true, trim: true },
    cart: [
      {
        id: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        cost: { type: Number, required: true, min: 0 },
        name: { type: String },
        image: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("account", Account);
