const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Product = new Schema(
  {
    name: { type: String, maxLength: 255 },
    brand: { type: String, maxLength: 255 },
    description: { type: String, maxLength: 600 },
    color: { type: String, maxLength: 255 },
    image: { type: Object },
    slug: { type: String, slug: "name", unique: true },
    status: { type: String },
    cost: { type: Number },
    size: { type: Object },
  },
  {
    timestamps: true,
  }
);

mongoose.plugin(slug);
Product.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("product", Product);
