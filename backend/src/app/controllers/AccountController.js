const Account = require("../models/Account");
const bcrypt = require("bcryptjs");

class AccountController {
  show(req, res, next) {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;
    const filter = search
      ? { $or: [{ name: { $regex: search, $options: "i" } }, { user: { $regex: search, $options: "i" } }] }
      : {};
    Promise.all([
      Account.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limitNum).lean(),
      Account.countDocuments(filter),
    ])
      .then(([account, total]) =>
        res.json({ account, total, currentPage: pageNum, totalPages: Math.ceil(total / limitNum) })
      )
      .catch(next);
  }

  //[GET]/account/:id
  showInformation(req, res, next) {
    Account.findById(req.params.id)
      .lean()
      .then((account) => {
        const formData = {
          user: account.user,
          name: account.name,
          role: account.role,
        };

        res.json(formData);
      })
      .catch(next);
  }

  //[PUT]/account/:id
  async updatePassword(req, res, next) {
    const { oldPassword, newPassword } = req.body;
    try {
      const account = await Account.findById(req.params.id);
      if (!account) return res.status(404).json({ message: "Account not found" });

      const isMatch = await bcrypt.compare(oldPassword, account.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      account.password = await bcrypt.hash(newPassword, 10);
      await account.save();
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  //[POST] /dashboard/account/create
  async create(req, res, next) {
    try {
      const { password, ...rest } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const account = new Account({ ...rest, password: hashedPassword });
      await account.save();
      res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
      next(err);
    }
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
