const Customer = require("../models/Customer");

class CustomerController {
  show(req, res, next) {
    Customer.find({})
      .lean()
      .then((customers) => res.json({ customers }))
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
