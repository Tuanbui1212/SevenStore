const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

const Schema = mongoose.Schema;

const Product = new Schema(
  {
    name: { type: String, maxLength: 255 },
    brand: { type: String, maxLength: 255 },
    description: { type: String, maxLength: 600 },
    image: { type: Object },
    slug: { type: String, slug: "name", unique: true },
    status: { type: String },
    cost: { type: Number, unique: true },
    size: { type: Object },
  },
  {
    timestamps: true,
  }
);

mongoose.plugin(slug);

module.exports = mongoose.model("product", Product);
