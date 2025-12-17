const Order = require("../models/Order");
const Product = require("../models/Product");
class OrderController {
  // [GET] /my-orders?user=ten_user
  showByUser(req, res, next) {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ message: "User is required" });
    }

    Order.find({ user })
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .lean()
      .then((orders) => {
        res.json({ order: orders });
      })
      .catch(next);
  }

  // [GET] /dashboard/orders/count-pending
  countPending(req, res, next) {
    console.log("--> Đang chạy vào hàm countPending..."); // Log kiểm tra

    // Kiểm tra xem Model có load được không
    if (!Order) {
      console.error(
        "LỖI: Không tìm thấy Model Order. Kiểm tra lại đường dẫn require ở đầu file!"
      );
      return res
        .status(500)
        .json({ message: "Server Error: Order Model not found" });
    }

    Order.countDocuments({ status: "Pending" })
      .then((count) => {
        console.log("--> Đếm thành công:", count);
        res.json({ count });
      })
      .catch((err) => {
        console.error("--> LỖI KHI ĐẾM:", err);
        next(err);
      });
  }

  // [GET] /dashboard/orders/manage/:type
  showManage(req, res, next) {
    const { type } = req.params;
    let query = {};

    if (type === "active") {
      query = { status: { $in: ["Pending", "Confirmed", "Shipping"] } };
    } else {
      query = { status: { $in: ["Delivered", "Cancelled"] } };
    }

    Order.find(query)
      .sort({ createdAt: -1 })
      .then((orders) => res.json(orders))
      .catch(next);
  }

  // Update order status
  updateStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    Order.findById(id)
      .then((order) => {
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }

        const oldStatus = order.status;

        if (status === "Cancelled" && oldStatus !== "Cancelled") {
          const promises = order.items.map((item) => {
            return Product.findById(item.productId).then((product) => {
              if (product) {
                product.size[item.size] += item.quantity;
                product.markModified("size");
                return product.save();
              }
            });
          });

          return Promise.all(promises).then(() => order);
        }

        return order;
      })
      .then((order) => {
        order.status = status;
        return order.save();
      })
      .then((updatedOrder) => {
        res.json({
          message: "Order updated successfully",
          order: updatedOrder,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Error updating order" });
      });
  }
}

module.exports = new OrderController();
