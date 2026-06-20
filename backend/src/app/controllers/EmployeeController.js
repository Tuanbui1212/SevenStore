const Employee = require("../models/Employees");
const {
  mongooseToObject,
  muntipleMongooseToObject,
} = require("../../util/mongoose");

class EmployeeController {
  show(req, res, next) {
    const { page = 1, limit = 10, search = "", sortKey = "updatedAt", sortDir = "desc" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const sortBy = { [sortKey]: sortDir === "asc" ? 1 : -1 };
    Promise.all([
      Employee.find(filter).sort(sortBy).skip(skip).limit(limitNum).lean(),
      Employee.countDocuments(filter),
      Employee.countDocumentsWithDeleted({ deleted: true }),
    ])
      .then(([employees, total, deletedCount]) =>
        res.json({ employees, deletedCount, total, currentPage: pageNum, totalPages: Math.ceil(total / limitNum) })
      )
      .catch(next);
  }

  // [PORT] /dashboard/employee/create
  create(req, res, next) {
    const employee = new Employee(req.body);
    employee
      .save()
      .then(() =>
        res.status(201).json({ message: "Employee created successfully" })
      )
      .catch(next);
  }

  //[Get] /dashboard/employee/:id/edit
  edit(req, res, next) {
    Employee.findById(req.params.id)
      .then((employee) =>
        res.json({
          employee: mongooseToObject(employee),
        })
      )
      .catch(next);
  }

  //[PUT] /dashboard/employee/:id sửa thông tin
  update(req, res, next) {
    Employee.updateOne({ _id: req.params.id }, req.body)
      .then(() =>
        res.status(200).json({ message: "Employee updated successfully" })
      )
      .catch(next);
  }

  //[Delete] /dashboard/employee/trash/:id Xóa thông tin
  //[Delete] /dashboard/employee/trash/:id Xóa thông tin truc tiep trong database
  delete(req, res, next) {
    Employee.deleteOne({ _id: req.params.id }, req.body)
      .then(() =>
        res.status(200).json({ message: "Employee delete successfully" })
      )
      .catch(next);
  }

  // [Delete] /dashboard/employee/:id Xóa thông tin mềm
  deleteSoft(req, res, next) {
    Employee.delete({ _id: req.params.id }, req.body)
      .then(() =>
        res.status(200).json({ message: "Employee delete successfully" })
      )
      .catch(next);
  }

  //[GET] /dashboard/employee/trash Danh sach da xoa
  trashEmpolyee(req, res, next) {
    Employee.findWithDeleted({ deleted: true })
      .lean()
      .then((trashEmployee) => res.json({ trashEmployee }))
      .catch(next);
  }

  //[PATCH]/dashboard/employee/:id/restore Khoi Phuc
  restore(req, res, next) {
    Employee.restore({ _id: req.params.id })
      .then(() =>
        res.status(200).json({ message: "Employee restore successfully" })
      )
      .catch(next);
  }
}

module.exports = new EmployeeController();
