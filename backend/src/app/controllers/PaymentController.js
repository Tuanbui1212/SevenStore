const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Account = require("../models/Account");
const Customer = require("../models/Customer");
const vnpayService = require("../services/vnpayService");

function canUseTransaction() {
  try {
    const topology = mongoose.connection?.client?.topology?.description;
    return Boolean(
      topology?.setName ||
      topology?.type === "ReplicaSetWithPrimary" ||
      topology?.type === "Sharded"
    );
  } catch {
    return false;
  }
}

class PaymentController {
  async create(req, res) {
    const { formData, checkedItems = [], totalCost } = req.body;
    const user = req.user?.user || req.body.user;

    if (!user) {
      return res.status(400).json({ message: "User is required to place an order" });
    }
    if (!formData || !formData.name || !formData.phone || !formData.address) {
      return res.status(400).json({ message: "Please fill in all required shipping details" });
    }
    if (!checkedItems || checkedItems.length === 0) {
      return res.status(400).json({ message: "No items selected for checkout" });
    }

    let session = null;
    let useTransaction = false;

    if (canUseTransaction()) {
      try {
        session = await mongoose.startSession();
        session.startTransaction();
        useTransaction = true;
      } catch (e) {
        session = null;
        useTransaction = false;
      }
    }

    try {
      const accountQuery = Account.findOne({ user });
      const account = useTransaction ? await accountQuery.session(session) : await accountQuery;
      if (!account) throw new Error("Account not found");

      // Verify stock & calculate real prices from database
      const orderItems = [];
      let calculatedSubtotal = 0;

      for (const item of checkedItems) {
        const prodQuery = Product.findById(item.id);
        const product = useTransaction ? await prodQuery.session(session) : await prodQuery;
        if (!product) throw new Error(`Product not found: ${item.id}`);

        const stock = product.size && product.size[item.size] !== undefined ? product.size[item.size] : 0;
        if (stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}" size ${item.size}. Available: ${stock}`);
        }

        // Deduct stock
        product.size[item.size] = stock - item.quantity;
        product.markModified("size");
        if (useTransaction) {
          await product.save({ session });
        } else {
          await product.save();
        }

        const realCost = typeof product.cost === "number" ? product.cost : (item.cost || 0);
        calculatedSubtotal += realCost * item.quantity;

        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: realCost,
          size: item.size,
        });
      }

      // Xoá sản phẩm đã mua khỏi giỏ hàng
      account.cart = account.cart.filter(
        (cartItem) =>
          !checkedItems.some(
            (item) =>
              item.id.toString() === cartItem.id.toString() &&
              item.size === cartItem.size
          )
      );

      if (useTransaction) {
        await account.save({ session });
      } else {
        await account.save();
      }

      // Shipping fee 30.000đ
      const shippingFee = 30000;
      const finalPrice = calculatedSubtotal + shippingFee;

      const order = new Order({
        user,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "",
        address: formData.address,
        city: formData.city || "",
        note: formData.note || "",
        paymentMethod: formData.payment || "ShipCod",
        totalPrice: finalPrice,
        items: orderItems,
      });

      if (useTransaction) {
        await order.save({ session });
        await session.commitTransaction();
      } else {
        await order.save();
      }

      // Save customer record
      Customer.findOne({ phone: formData.phone })
        .then((existing) => {
          if (!existing) {
            new Customer({
              name: formData.name,
              phone: formData.phone,
              address: `${formData.address}${formData.city ? `, ${formData.city}` : ""}`,
            }).save().catch(() => {});
          }
        })
        .catch(() => {});

      let returnUrl = "/my-orders";
      if (formData.payment === "VnPay") {
        returnUrl = vnpayService.createPaymentUrl(req, order._id, finalPrice);
      }

      res.status(201).json({
        message: formData.payment === "VnPay"
          ? "Redirecting to VNPay for payment..."
          : "Thank you! Your order has been placed successfully.",
        url: returnUrl,
        orderId: order._id,
      });
    } catch (err) {
      if (useTransaction && session) {
        await session.abortTransaction();
      }
      res.status(400).json({ message: err.message });
    } finally {
      if (session) {
        session.endSession();
      }
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
      .then((order) => {
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ order });
      })
      .catch(next);
  }
}

module.exports = new PaymentController();
