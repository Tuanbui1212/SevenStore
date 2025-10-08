const Product = require("../models/Product");
const Account = require("../models/Account");

const {
  mongooseToObject,
  muntipleMongooseToObject,
} = require("../../util/mongoose");

class SiteController {
  index(req, res, next) {
    Product.find({ status: "New" })
      .then((newProduct) => {
        res.json({ newProduct: muntipleMongooseToObject(newProduct) });
      })
      .catch(next);
  }

  checkLogin(req, res, next) {
    const { username, password } = req.body;

    Account.findOne({ user: username }) // ✅ Tìm 1 account
      .lean()
      .then((account) => {
        if (!account) {
          res.json({ success: false, message: "Không tồn tại tài khoản nào" });
        }

        if (password === account.password) {
          res.json({
            success: true,
            message: "Đăng nhập thành công",
            redirectUrl: "/",
          });
        } else {
          res.json({
            success: false,
            message: "Sai mật khẩu",
          });
        }
      })
      .catch(next);
  }
}

module.exports = new SiteController();
