const Account = require("../models/Account");

class AccountController {
  show(req, res, next) {
    Account.find({})
      .lean()
      .then((account) => res.json({ account }))
      .catch(next);
  }

  //[POST]
  create(req, res, next) {
    const account = new Account(req.body);
    account
      .save()
      .then(res.status(201).json({ message: "Account created successfully" }))
      .catch(next);
  }
}

module.exports = new AccountController();
