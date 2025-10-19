const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Order = new Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 255 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true, maxLength: 255 },
    city: { type: String, required: true, trim: true },
    note: { type: String, default: "" },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],

    totalPrice: { type: Number, required: true },

    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order", Order);
