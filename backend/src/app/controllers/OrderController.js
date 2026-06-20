const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
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
    const { page = 1, limit = 10, search = "", sortKey = "createdAt", sortDir = "desc" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const baseFilter = type === "active"
      ? { status: { $in: ["Pending", "Confirmed", "Shipping"] } }
      : { status: { $in: ["Delivered", "Cancelled"] } };

    const filter = search
      ? { ...baseFilter, $or: [{ name: { $regex: search, $options: "i" } }, { phone: { $regex: search } }, { city: { $regex: search, $options: "i" } }] }
      : baseFilter;

    const sortBy = { [sortKey]: sortDir === "asc" ? 1 : -1 };

    Promise.all([
      Order.find(filter).sort(sortBy).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ])
      .then(([orders, total]) =>
        res.json({ orders, total, currentPage: pageNum, totalPages: Math.ceil(total / limitNum) })
      )
      .catch(next);
  }

  // [GET] /dashboard/orders/stats — Monthly aggregated stats with real growth
  getStats(req, res, next) {
    Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            orders: { $sum: 1 },
            revenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Product.countDocuments({}),
      Customer.countDocuments({}),
    ])
      .then(([rawStats, totalProducts, totalCustomers]) => {
        let totalRevenue = 0;
        let totalOrders = 0;

        const stats = rawStats.map((item, index) => {
          const prevRevenue = index > 0 ? rawStats[index - 1].revenue : 0;
          const growth =
            prevRevenue > 0
              ? parseFloat((((item.revenue - prevRevenue) / prevRevenue) * 100).toFixed(1))
              : 0;

          totalRevenue += item.revenue;
          totalOrders += item.orders;

          return {
            month: `${item._id.month}/${item._id.year}`,
            year: item._id.year,
            monthNum: item._id.month,
            orders: item.orders,
            revenue: item.revenue,
            profit: Math.round(item.revenue * 0.3),
            growth,
            status: item.revenue > 5000000 ? "High" : "Medium",
          };
        });

        res.json({ stats, totalRevenue, totalOrders, totalProducts, totalCustomers });
      })
      .catch(next);
  }

  // Update order status
  async updateStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(id).session(session);
      if (!order) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Order not found" });
      }

      // Nếu huỷ đơn → hoàn lại tồn kho
      if (status === "Cancelled" && order.status !== "Cancelled") {
        for (const item of order.items) {
          const product = await Product.findById(item.productId).session(session);
          if (product) {
            product.size[item.size] += item.quantity;
            product.markModified("size");
            await product.save({ session });
          }
        }
      }

      order.status = status;
      const updatedOrder = await order.save({ session });

      await session.commitTransaction();
      res.json({ message: "Order updated successfully", order: updatedOrder });
    } catch (err) {
      await session.abortTransaction();
      console.error(err);
      res.status(500).json({ message: "Error updating order" });
    } finally {
      session.endSession();
    }
  }
}

module.exports = new OrderController();
