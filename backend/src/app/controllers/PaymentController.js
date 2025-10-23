const Order = require("../models/Order");
const Product = require("../models/Product");
const Account = require("../models/Account");
class PaymentController {
  create(req, res) {
    const { formData, user, checkedItems, totalCost } = req.body;

    Account.findOne({ user })
      .then((account) => {
        if (!account) throw new Error("Account not found");

        return checkedItems
          .reduce((p, item) => {
            return p.then(() =>
              Product.findById(item.id).then((product) => {
                if (!product) throw new Error("Product not found");

                if (product.size[item.size] < item.quantity) {
                  throw new Error("Insufficient product quantity available");
                }

                //Xoa sp trong rỏ hàng
                account.cart = account.cart.filter(
                  (items) =>
                    !(
                      items.id.toString() === item.id.toString() &&
                      items.size === item.size
                    )
                );

                //Giảm số lượng khi mua
                product.size[item.size] -= item.quantity;
                product.markModified("size");

                return product.save();
              })
            );
          }, Promise.resolve())
          .then(() => {
            return account.save();
          });
      })
      .then(() => {
        const orderData = {
          user: user,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          note: formData.note,
          paymentMethod: formData.payment,
          totalPrice: totalCost,
          items: checkedItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.cost,
            size: item.size,
          })),
        };

        const order = new Order(orderData);
        return order.save();
      })
      .then(() => {
        res.status(201).json({
          message: "✅ Thank you! Your order has been placed successfully.",
          url: "/",
        });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }

  show(req, res, next) {
    Order.find()
      .lean()
      .then((order) => {
        res.json({ order });
      })
      .catch(next);
  }

  showDetail(req, res, next) {
    const { id } = req.params;

    Order.findById(id)
      .populate("items.productId")
      .lean()
      .then((order) => {
        res.json({ order });
      })
      .catch(next);
  }
}

module.exports = new PaymentController();
