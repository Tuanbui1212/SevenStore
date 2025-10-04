const Product = require("../models/Product");
const {
  mongooseToObject,
  muntipleMongooseToObject,
} = require("../../util/mongoose");

class SiteController {
  index(req, res, next) {
    Product.find({ status: "New" })
      .then((newProduct) => {
        res.json({ newProduct: muntipleMongooseToObject(newProduct) });
      })
      .catch(next);
  }
}

module.exports = new SiteController();
