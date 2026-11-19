const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

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

class OrderController {
  // [GET] /my-orders?user=ten_user
  showByUser(req, res, next) {
    const isStaffOrAdmin = req.user && (req.user.role === "admin" || req.user.role === "staff");
    const user = isStaffOrAdmin ? (req.query.user || req.user?.user) : req.user?.user;

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

  // [PUT] /my-orders/:id/status (Customer action: Cancel or Confirm Received)
  async customerUpdateStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;
    const currentUser = req.user?.user;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    try {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check ownership
      const isOwner = order.user === currentUser;
      const isAdminOrStaff = req.user && (req.user.role === "admin" || req.user.role === "staff");

      if (!isOwner && !isAdminOrStaff) {
        return res.status(403).json({ message: "You are not authorized to update this order" });
      }

      // Business rule: Customer can only Cancel if Pending, or mark Delivered if Shipping
      if (!isAdminOrStaff) {
        if (status === "Cancelled") {
          if (order.status !== "Pending") {
            return res.status(400).json({
              message: "Cannot cancel order that is already being processed or shipped.",
            });
          }
        } else if (status === "Delivered") {
          if (order.status !== "Shipping") {
            return res.status(400).json({
              message: "Order can only be marked delivered once shipped.",
            });
          }
        } else {
          return res.status(400).json({
            message: "Invalid status update requested by customer.",
          });
        }
      }

      // If cancelling: return stock back to inventory
      if (status === "Cancelled" && order.status !== "Cancelled") {
        for (const item of order.items) {
          const product = await Product.findById(item.productId);
          if (product) {
            if (!product.size) product.size = {};
            product.size[item.size] = (product.size[item.size] || 0) + item.quantity;
            product.markModified("size");
            await product.save();
          }
        }
      }

      order.status = status;
      const updatedOrder = await order.save();

      return res.json({
        message: "Order updated successfully",
        order: updatedOrder,
      });
    } catch (err) {
      next(err);
    }
  }

  // [GET] /dashboard/orders/count-pending
  countPending(req, res, next) {
    Order.countDocuments({ status: "Pending" })
      .then((count) => {
        res.json({ count });
      })
      .catch(next);
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

  // Admin / Staff: Update order status
  async updateStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

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
      const orderQuery = Order.findById(id);
      const order = useTransaction ? await orderQuery.session(session) : await orderQuery;
      if (!order) {
        if (useTransaction && session) await session.abortTransaction();
        return res.status(404).json({ message: "Order not found" });
      }

      // Nếu huỷ đơn → hoàn lại tồn kho
      if (status === "Cancelled" && order.status !== "Cancelled") {
        for (const item of order.items) {
          const prodQuery = Product.findById(item.productId);
          const product = useTransaction ? await prodQuery.session(session) : await prodQuery;
          if (product) {
            if (!product.size) product.size = {};
            product.size[item.size] = (product.size[item.size] || 0) + item.quantity;
            product.markModified("size");
            if (useTransaction) {
              await product.save({ session });
            } else {
              await product.save();
            }
          }
        }
      }

      // Nếu chuyển từ Cancelled sang trạng thái khác → trừ lại tồn kho
      if (order.status === "Cancelled" && status !== "Cancelled") {
        for (const item of order.items) {
          const prodQuery = Product.findById(item.productId);
          const product = useTransaction ? await prodQuery.session(session) : await prodQuery;
          if (product) {
            const currentStock = (product.size && product.size[item.size]) || 0;
            if (currentStock < item.quantity) {
              throw new Error(`Insufficient stock for "${product.name}" size ${item.size} to reactivate order`);
            }
            product.size[item.size] = currentStock - item.quantity;
            product.markModified("size");
            if (useTransaction) {
              await product.save({ session });
            } else {
              await product.save();
            }
          }
        }
      }

      order.status = status;
      const updatedOrder = useTransaction ? await order.save({ session }) : await order.save();

      if (useTransaction && session) {
        await session.commitTransaction();
      }

      res.json({ message: "Order updated successfully", order: updatedOrder });
    } catch (err) {
      if (useTransaction && session) {
        await session.abortTransaction();
      }
      console.error(err);
      res.status(500).json({ message: err.message || "Error updating order" });
    } finally {
      if (session) {
        session.endSession();
      }
    }
  }
}

module.exports = new OrderController();
