const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Account = require("../models/Account");
const Customer = require("../models/Customer");
const vnpayService = require("../services/vnpayService.js");

class PaymentController {
  async create(req, res) {
    const { formData, user, checkedItems, totalCost } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const account = await Account.findOne({ user }).session(session);
      if (!account) throw new Error("Account not found");

      // Kiểm tra + trừ tồn kho từng sản phẩm
      for (const item of checkedItems) {
        const product = await Product.findById(item.id).session(session);
        if (!product) throw new Error(`Product not found: ${item.id}`);

        if (product.size[item.size] < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}" size ${item.size}`);
        }

        product.size[item.size] -= item.quantity;
        product.markModified("size");
        await product.save({ session });
      }

      // Xóa sản phẩm đã mua khỏi giỏ hàng
      account.cart = account.cart.filter(
        (cartItem) =>
          !checkedItems.some(
            (item) =>
              item.id.toString() === cartItem.id.toString() &&
              item.size === cartItem.size
          )
      );
      await account.save({ session });

      // Tạo đơn hàng
      const order = new Order({
        user,
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
      });
      await order.save({ session });

      await session.commitTransaction();

      // Tạo khách hàng mới (ngoài transaction — không critical, thất bại không sao)
      const phone = formData.phone;
      Customer.findOne({ phone }).then((existing) => {
        if (existing) return;
        new Customer({
          name: formData.name,
          phone,
          address: `${formData.address}, ${formData.city}`,
        }).save().catch(() => {});
      });

      let paymentUrl = "/";
      if (formData.payment === "VnPay") {
        const ipAddr =
          req.headers["x-forwarded-for"] ||
          req.connection?.remoteAddress ||
          req.socket?.remoteAddress ||
          "127.0.0.1";

        paymentUrl = vnpayService.createPaymentUrl({
          amount: totalCost,
          ipAddr,
          txnRef: order._id.toString(),
          orderInfo: `Thanh toan don hang ${order._id}`,
        });
      }

      res.status(201).json({
        message: "Đơn hàng đã được tạo thành công!",
        url: paymentUrl,
      });
    } catch (err) {
      await session.abortTransaction();
      res.status(500).json({ message: err.message });
    } finally {
      session.endSession();
    }
  }

  show(req, res, next) {
    Order.find()
      .sort({ createdAt: -1 })
      .lean()
      .then((order) => res.json({ order }))
      .catch(next);
  }

  showDetail(req, res, next) {
    const { id } = req.params;
    Order.findById(id)
      .populate("items.productId")
      .lean()
      .then((order) => res.json({ order }))
      .catch(next);
  }
}

module.exports = new PaymentController();
