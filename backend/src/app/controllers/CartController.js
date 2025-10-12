const Account = require("../models/Account");

class CartController {
  addCart(req, res, next) {
    const { user } = req.query;
    const formData = req.body;

    console.log("User:", user);
    console.log("Form data:", formData);

    if (!user) {
      return res.status(400).json({ message: "Thiếu dữ liệu cần thiết" });
    }

    Account.findOne({ user })
      .then((account) => {
        if (!account) {
          return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        }

        // Tìm sản phẩm trong giỏ
        const existingItem = account.cart.find(
          (item) => item.id === formData.id && item.size === formData.size
        );

        if (existingItem) {
          existingItem.quantity += formData.quantity;
        } else {
          account.cart.push(formData);
        }

        // Lưu thay đổi
        return account.save();
      })
      .then((updatedAccount) => {
        res.status(200).json({
          message: "Đã thêm vào giỏ hàng",
          cart: updatedAccount.cart,
        });
      })
      .catch((err) => {
        console.error("Lỗi thêm giỏ hàng:", err);
        res.status(500).json({
          message: "Lỗi server khi thêm giỏ hàng",
          error: err.message,
        });
      });
  }

  show(req, res, next) {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ message: "Thiếu dữ liệu cần thiết" });
    }

    Account.findOne({ user })
      .then((account) => {
        if (!account) {
          return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        }

        const cart = account.cart.map((item) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          cost: item.cost,
        }));

        res.json({ cart });
      })
      .catch(next);
  }
}

module.exports = new CartController();
