const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    user: { type: String, required: true, trim: true, maxLength: 255 },
    name: { type: String, required: true, trim: true, maxLength: 255 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true, maxLength: 255 },
    city: { type: String, required: true, trim: true },
    note: { type: String, default: "" },
    paymentMethod: {
      type: String,
    },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order", Order);
