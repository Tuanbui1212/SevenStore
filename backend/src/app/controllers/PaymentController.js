const Order = require("../models/Order");

class PaymentController {
  create(req, res, next) {
    console.log(req.body.formData);
    console.log(req.body.user);
    console.log(req.body.checkedItems);

    Order.save();
  }
}

module.exports = new PaymentController();
