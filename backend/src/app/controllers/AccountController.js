const Account = require("../models/Account");

class AccountController {
  show(req, res, next) {
    Account.find({})
      .sort({ updatedAt: -1 })
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

  //[GET]/dashboard/account/:id
  edit(req, res, next) {
    Account.findId(req.params.id)
      .lean()
      .then((account) => res.json({ account }))
      .catch(next);
  }

  //[POST]/dashboard/account/:id
  update(req, res, next) {
    Account.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.status(200).json({ message: "updated successfully" }))
      .catch(next);
  }
}

module.exports = new AccountController();
