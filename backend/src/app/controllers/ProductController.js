const Product = require("../models/Product");
const {
  mongooseToObject,
  muntipleMongooseToObject,
} = require("../../util/mongoose");

class ProductController {
  show(req, res, next) {
    const { brand } = req.params;

    Product.find({ brand: { $regex: brand, $options: "i" } })
      .lean()
      .then((newProduct) => {
        res.json({ newProduct });
      })
      .catch(next);
  }

  showList(req, res, next) {
    Product.find()
      .lean()
      .then((listProduct) => {
        res.json({ listProduct });
      })
      .catch(next);
  }

  //[POST] /dashboard/products/create
  create(req, res, next) {
    const product = new Product(req.body);
    product
      .save()
      .then(() =>
        res.status(201).json({ message: "Product created successfully" })
      )
      .catch(next);
  }

  //[Get] /dashboard/products/:id
  edit(req, res, next) {
    Product.findById(req.params.id)
      .lean()
      .then((product) => res.json({ product }))
      .catch(next);
  }

  //[PUT] /dashboard/products/:id sửa thông tin
  update(req, res, next) {
    Product.updateOne({ _id: req.params.id }, req.body)
      .then(() =>
        res.status(200).json({ message: "Product updated successfully" })
      )
      .catch(next);
  }
}

module.exports = new ProductController();
