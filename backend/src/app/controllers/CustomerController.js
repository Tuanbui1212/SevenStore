const Customer = require("../models/Customer");

class CustomerController {
  show(req, res, next) {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }
    if (status === "Inactive") {
      filter.status = "Inactive";
    } else if (status === "Active") {
      filter.status = { $ne: "Inactive" };
    }
    Promise.all([
      Customer.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limitNum).lean(),
      Customer.countDocuments(filter),
      Customer.countDocuments({}),
      Customer.countDocuments({ status: "Inactive" }),
    ])
      .then(([customers, total, allCount, inactiveCount]) => {
        const statusCounts = {
          All: allCount,
          Active: Math.max(0, allCount - inactiveCount),
          Inactive: inactiveCount,
        };
        res.json({
          customers,
          total,
          statusCounts,
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
        });
      })
      .catch(next);
  }

  //[Get] /dashboard/customers/:id
  edit(req, res, next) {
    Customer.findById(req.params.id)
      .lean()
      .then((customer) => {
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json({ customer });
      })
      .catch(next);
  }

  //[PUT] /dashboard/customers/:id
  update(req, res, next) {
    Customer.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.status(200).json({ message: "updated successfully" }))
      .catch(next);
  }
}

module.exports = new CustomerController();
