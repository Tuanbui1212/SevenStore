const Account = require("../models/Account");
const Product = require("../models/Product");

class CartController {
  addCart(req, res, next) {
    const { user } = req.query;
    const formData = req.body;

    if (!user) {
      return res.status(400).json({ message: "Missing required data." });
    }

    Account.findOne({ user })
      .then((account) => {
        if (!account) {
          return res.status(404).json({ message: "Account not found." });
        }

        return Product.findById(formData.id).then((product) => {
          if (!product) {
            return res.status(404).json({ message: "Product not found." });
          }

          const existingItem = account.cart.find(
            (item) => item.id === formData.id && item.size === formData.size
          );

          const size = formData.size;

          if (existingItem) {
            const newQuantity = existingItem.quantity + formData.quantity;

            if (newQuantity > product.size[size]) {
              return res.status(400).json({
                message: "The quantity you selected exceeds available stock.",
              });
            }

            existingItem.quantity = newQuantity;
          } else {
            if (formData.quantity > product.size[size]) {
              return res.status(400).json({
                message: "The quantity you selected exceeds available stock.",
              });
            }

            account.cart.push(formData);
          }

          return account.save().then((updatedAccount) => {
            res.status(200).json({
              message: "Added to cart.",
              cart: updatedAccount.cart,
            });
          });
        });
      })
      .catch((err) => {
        console.error("Error adding to cart:", err);
        res.status(500).json({
          message: "Server error while adding to cart.",
          error: err.message,
        });
      });
  }

  show(req, res, next) {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ message: "Account not found" });
    }

    Account.findOne({ user })
      .then((account) => {
        if (!account) {
          return res.status(404).json({ message: "Account not found" });
        }

        const sortedCart = account.cart.sort(
          (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
        );

        const cart = sortedCart.map((item) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          cost: item.cost,
          brand: item.brand,
          slug: item.slug,
        }));

        res.json({ cart });
      })
      .catch(next);
  }

  //[PUT] /cart sửa thông tin
  updateCart(req, res, next) {
    const { user } = req.query;
    const data = req.body;

    Account.findOne({ user })
      .then((account) => {
        if (!account) {
          return res.status(404).json({ message: "Account not found" });
        }

        const existingItem = account.cart.find(
          (item) => item.id === data.id && item.size === data.size
        );

        existingItem.quantity = data.quantity;

        return account.save();
      })
      .catch(next);
  }

  //[DELETE] /cart xoa thông tin
  delete(req, res, next) {
    const { user, deleteId, size } = req.query;

    Account.findOne({ user })
      .then((account) => {
        if (!account) {
          return res.status(404).json({ message: "Account not found" });
        }

        // Giữ lại các sản phẩm KHÔNG trùng deleteId + size
        account.cart = account.cart.filter(
          (item) => !(item.id === deleteId && item.size === size)
        );

        // Lưu lại tài khoản sau khi xóa sản phẩm
        return account.save().then(() => {
          res.status(200).json({ message: "✅ Successfully deleted!" });
        });
      })
      .catch(next);
  }
}

module.exports = new CartController();
