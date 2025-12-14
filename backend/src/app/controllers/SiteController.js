const Product = require("../models/Product");
const Account = require("../models/Account");
//const jwt = require("jsonwebtoken");

class SiteController {
  index(req, res, next) {
    Product.find({ status: "New" })
      .lean()
      .then((newProduct) => {
        res.json({ newProduct });
      })
      .catch(next);
  }

  checkLogin(req, res, next) {
    const { username, password } = req.body;

    Account.findOne({ user: username })
      .lean()
      .then((account) => {
        if (!account) {
          return res.json({
            success: false,
            message: "Account not found",
          });
        }

        if (password === account.password) {
          let Url = "/";

          if (account.role === "admin" || account.role === "staff") {
            Url = "/dashboard";
          }
          return res.json({
            id: account._id,
            role: account.role,
            success: true,
            id: account._id,
            message: "Login successful",
            redirectUrl: Url,
            user: account.user,
          });
        } else {
          return res.json({
            success: false,
            message: "The password you entered is incorrect",
          });
        }
      })
      .catch(next);
  }

  register(req, res, next) {
    const { formData } = req.body; // lấy object formData từ body
    if (!formData)
      return res.status(400).json({ message: "Required data is missing" });

    const { name, user, password } = formData;

    if (!name || !user || !password) {
      return res
        .status(400)
        .json({ message: "Some registration information is missing" });
    }

    Account.findOne({ user })
      .lean()
      .then((existingUser) => {
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "This username is already taken" });
        }

        const account = new Account(formData);

        return account
          .save()
          .then(() =>
            res.status(201).json({ message: "Registration successful" })
          )
          .catch((err) => {
            console.error("Lỗi khi lưu tài khoản:", err);
            res
              .status(500)
              .json({ message: "Server error while creating account" });
          });
      })
      .catch((err) => {
        console.error("Lỗi truy vấn:", err);
        res
          .status(500)
          .json({ message: "Server error while checking the account" });
      });
  }

  //[GET] /search
  search(req, res, next) {
    const { value } = req.query;

    Product.find({ name: { $regex: value, $options: "i" } })
      .lean()
      .then((product) => {
        res.json({ product });
      })
      .catch(next);
  }
}

module.exports = new SiteController();
