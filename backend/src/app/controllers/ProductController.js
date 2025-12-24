const Product = require("../models/Product");

class ProductController {
  //[GET]/product/:brand/
  show(req, res, next) {
    const { brand } = req.params;
    const { color, type, min, max, sort } = req.query;

    let filter = {};

    let sortBy = {};

    if (sort === "Best Sellers") {
      filter.status = { $regex: "BestSeller", $options: "i" };
    } else if (sort === "Newest") {
      sortBy = { updatedAt: 1 };
    } else if (sort === "Price High To Low") {
      sortBy = { cost: 1 };
    } else if (sort === "Price Low To High") {
      sortBy = { cost: -1 };
    }

    if (brand === "sale") {
      filter.status = { $regex: "sale", $options: "i" };
    } else if (brand === "NEW ARRIVALS") {
      filter.status = { $regex: "new", $options: "i" };
    } else if (brand !== "all") {
      filter.brand = { $regex: brand, $options: "i" };
    }

    if (color) {
      filter.color = { $regex: color, $options: "i" };
    }
    if (type) {
      filter.$or = [
        { name: { $regex: type, $options: "i" } },
        { description: { $regex: type, $options: "i" } },
      ];
    }
    if (min || max) {
      filter.cost = {};
      if (min) filter.cost.$gte = Number(min);
      if (max) filter.cost.$lte = Number(max);
    }

    Product.find(filter)
      .sort(sortBy)
      .lean()
      .then((newProduct) => {
        console.log(`Found ${newProduct.length} products with filter:`, filter);
        res.json({ newProduct });
      })
      .catch(next);
  }

  //[GET]/product/:brand/:slug
  showDetail(req, res, next) {
    const { slug } = req.params;

    Product.findOne({ slug: { $regex: slug, $options: "i" } })
      .lean()
      .then((productDetail) => res.json({ productDetail }))
      .catch(next);
  }

  //[GET]/dashboard/products/:brand/:slug
  showList(req, res, next) {
    Promise.all([
      Product.find().sort({ updatedAt: -1 }).lean(),
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
