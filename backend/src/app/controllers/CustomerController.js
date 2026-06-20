const Customer = require("../models/Customer");

class CustomerController {
  show(req, res, next) {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    Promise.all([
      Customer.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limitNum).lean(),
      Customer.countDocuments(filter),
    ])
      .then(([customers, total]) =>
        res.json({ customers, total, currentPage: pageNum, totalPages: Math.ceil(total / limitNum) })
      )
      .catch(next);
  }

  //[Get] /dashboard/customers/:id
  edit(req, res, next) {
    Customer.findById(req.params.id)
      .lean()
      .then((customer) => res.json({ customer }))
      .catch(next);
  }

  //[PUT] /dashboard/customers/:id
  update(req, res, next) {
    Customer.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.status(200).json({ message: "updated successfully" }))
      .catch(next);
  }
}

module.exports = new CustomerController();
