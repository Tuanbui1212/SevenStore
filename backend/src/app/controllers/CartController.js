const Account = require("../models/Account");
const Product = require("../models/Product");

class CartController {
  async addCart(req, res, next) {
    const user = req.query.user || req.user?.user;
    const formData = req.body;

    if (!user) {
      return res.status(400).json({ message: "Missing user information." });
    }

    if (!formData || !formData.id || !formData.size) {
      return res.status(400).json({ message: "Missing product id or size." });
    }

    const quantity = parseInt(formData.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    try {
      const account = await Account.findOne({ user });
      if (!account) {
        return res.status(404).json({ message: "Account not found." });
      }

      const product = await Product.findById(formData.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      const size = formData.size;
      const availableStock = product.size && product.size[size] !== undefined ? product.size[size] : 0;

      const existingItem = account.cart.find(
        (item) => item.id.toString() === formData.id.toString() && item.size === size
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > availableStock) {
          return res.status(400).json({
            message: "The quantity you selected exceeds available stock.",
          });
        }
        existingItem.quantity = newQuantity;
      } else {
        if (quantity > availableStock) {
          return res.status(400).json({
            message: "The quantity you selected exceeds available stock.",
          });
        }

        account.cart.push({
          id: product._id.toString(),
          name: product.name,
          brand: product.brand,
          slug: product.slug,
          cost: product.cost,
          image: product.image?.image1 || formData.image || "",
          size: size,
          quantity: quantity,
        });
      }

      const updatedAccount = await account.save();
      return res.status(200).json({
        message: "Added to cart.",
        cart: updatedAccount.cart,
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
      return res.status(500).json({
        message: "Server error while adding to cart.",
        error: err.message,
      });
    }
  }

  show(req, res, next) {
    const user = req.query.user || req.user?.user;

    if (!user) {
      return res.status(400).json({ message: "User is required" });
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
          price: item.cost,
          cost: item.cost,
          quantity: item.quantity,
          image: item.image,
          brand: item.brand,
          slug: item.slug,
        }));

        res.json({ cart });
      })
      .catch(next);
  }

  //[PUT] /cart sửa thông tin
  async updateCart(req, res, next) {
    const user = req.query.user || req.user?.user;
    const data = req.body;

    if (!user) {
      return res.status(400).json({ message: "User is required" });
    }
    if (!data || !data.id || !data.size) {
      return res.status(400).json({ message: "Item id and size are required" });
    }

    const targetQuantity = parseInt(data.quantity, 10);
    if (isNaN(targetQuantity)) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    try {
      const account = await Account.findOne({ user });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const existingIndex = account.cart.findIndex(
        (item) => item.id.toString() === data.id.toString() && item.size === data.size
      );

      if (existingIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      if (targetQuantity <= 0) {
        // Remove item if quantity set to 0 or negative
        account.cart.splice(existingIndex, 1);
      } else {
        // Validate stock
        const product = await Product.findById(data.id);
        if (product && product.size && product.size[data.size] !== undefined) {
          if (targetQuantity > product.size[data.size]) {
            return res.status(400).json({
              message: "The quantity exceeds available stock.",
            });
          }
        }
        account.cart[existingIndex].quantity = targetQuantity;
      }

      const updatedAccount = await account.save();
      return res.status(200).json({
        message: "Cart updated successfully.",
        cart: updatedAccount.cart,
      });
    } catch (err) {
      next(err);
    }
  }

  //[DELETE] /cart xoa thông tin
  async delete(req, res, next) {
    const user = req.query.user || req.user?.user;
    const { deleteId, size } = req.query;

    if (!user) {
      return res.status(400).json({ message: "User is required" });
    }

    try {
      const account = await Account.findOne({ user });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      account.cart = account.cart.filter(
        (item) => !(item.id.toString() === deleteId?.toString() && item.size === size)
      );

      await account.save();
      return res.status(200).json({
        message: "Successfully deleted!",
        cart: account.cart,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();
