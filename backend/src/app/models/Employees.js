const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const Employee = new Schema(
  {
    name: { type: String, maxLength: 255, require: true },
    status: { type: String, maxLength: 255, require: true },
    role: { type: String, maxLength: 255, require: true },
    date: { type: Date, require: true },
    type: { type: String, maxLength: 255, require: true },
  },
  {
    timestamps: true,
  }
);

mongoose.plugin(slug);
Employee.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("employee", Employee);
