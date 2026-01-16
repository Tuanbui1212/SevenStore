const Product = require("../models/Product");
const Account = require("../models/Account");
const jwt = require("jsonwebtoken");

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

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tài khoản và mật khẩu",
      });
    }

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
          // --- PHẦN QUAN TRỌNG: TẠO TOKEN ---
          const payload = {
            id: account._id,
            user: account.user,
            role: account.role,
          };

          const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );

          return res.status(200).json({
            id: account._id,
            role: account.role,
            success: true,
            id: account._id,
            message: "Login successful",
            redirectUrl: Url,
            user: account.user,
            accessToken,
            username: payload,
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "The password you entered is incorrect",
          });
        }
      })
      .catch(next);
  }
  // [POST] /register
  register(req, res, next) {
    const { formData } = req.body; // lấy object formData từ body

    if (!formData)
      return res.status(400).json({ message: "Required data is missing" });

    console.log("Received registration data:", formData);

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
          .then((savedAccount) => {
            const payload = {
              id: savedAccount._id,
              name: savedAccount.name,
              user: savedAccount.user,
              role: savedAccount.role || "customer",
            };

            const accessToken = jwt.sign(
              payload,
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: process.env.JWT_EXPIRES_IN,
              }
            );

            res.status(201).json({
              message: "Registration successful",
              accessToken,
              user: {
                id: savedAccount._id,
                name: savedAccount.name,
                user: savedAccount.user,
                role: savedAccount.role,
              },
            });
          })
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
