const Product = require("../models/Product");
const Account = require("../models/Account");
//const jwt = require("jsonwebtoken");

const {
  mongooseToObject,
  muntipleMongooseToObject,
} = require("../../util/mongoose");

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

    Account.findOne({ user: username }) // ✅ Tìm 1 account
      .lean()
      .then((account) => {
        if (!account) {
          return res.json({
            success: false,
            message: "Không tồn tại tài khoản nào",
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
            message: "Đăng nhập thành công",
            redirectUrl: Url,
            user: account.user,
          });
        } else {
          return res.json({
            success: false,
            message: "Sai mật khẩu",
          });
        }
      })
      .catch(next);
  }

  register(req, res, next) {
    const { formData } = req.body; // lấy object formData từ body
    if (!formData)
      return res.status(400).json({ message: "Thiếu dữ liệu gửi lên" });

    const { name, user, password } = formData;

    if (!name || !user || !password) {
      return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
    }

    Account.findOne({ user })
      .lean()
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).json({ message: "Đã tồn tại tài khoản này" });
        }

        const account = new Account(formData);

        return account
          .save()
          .then(() => res.status(201).json({ message: "Đăng ký thành công" }))
          .catch((err) => {
            console.error("Lỗi khi lưu tài khoản:", err);
            res.status(500).json({ message: "Lỗi server khi tạo tài khoản" });
          });
      })
      .catch((err) => {
        console.error("Lỗi truy vấn:", err);
        res.status(500).json({ message: "Lỗi server khi kiểm tra tài khoản" });
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
