const Product = require("../models/Product");

class ProductController {
  show(req, res, next) {
    const { brand } = req.params;

    const filter =
      brand === "all" ? {} : { brand: { $regex: brand, $options: "i" } };

    Product.find(filter)
      .lean()
      .then((newProduct) => {
        res.json({ newProduct });
      })
      .catch(next);
  }

  //[GET]/dashboard/products
  showList(req, res, next) {
    // Product.find()
    //   .lean()
    //   .then((listProduct) => {
    //     res.json({ listProduct });
    //   })
    //   .catch(next);

    Promise.all([
      Product.find().lean(),
      Product.countDocumentsWithDeleted({ deleted: true }),
    ])
      .then(([listProduct, deletedCount]) =>
        res.json({
          deletedCount,
          listProduct,
        })
      )
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

  //[Delete] /dashboard/products/trash/:id Xóa thông tin
  //[Delete] /dashboard/products/trash/:id Xóa thông tin truc tiep trong database
  delete(req, res, next) {
    Product.deleteOne({ _id: req.params.id }, req.body)
      .then(() =>
        res.status(200).json({ message: "Product delete successfully" })
      )
      .catch(next);
  }

  // [Delete] /dashboard/products/:id Xóa thông tin mềm
  deleteSoft(req, res, next) {
    Product.delete({ _id: req.params.id }, req.body)
      .then(() =>
        res.status(200).json({ message: "Product delete successfully" })
      )
      .catch(next);
  }

  //[GET] /dashboard/products/trash Danh sach da xoa
  trashProduct(req, res, next) {
    Product.findWithDeleted({ deleted: true })
      .lean()
      .then((trashProducts) => res.json({ trashProducts }))
      .catch(next);
  }

  //[PATCH]/dashboard/products/:id/restore Khoi Phuc
  restore(req, res, next) {
    Product.restore({ _id: req.params.id })
      .then(() =>
        res.status(200).json({ message: "Product restore successfully" })
      )
      .catch(next);
  }
}

module.exports = new ProductController();
