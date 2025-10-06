const Employee = require("../models/Employees");
const {
  mongooseToObject,
  muntipleMongooseToObject,
} = require("../../util/mongoose");

class EmployeeController {
  show(req, res, next) {
    // Employee.find()
    //   .then((employees) => {
    //     res.json({ employees: muntipleMongooseToObject(employees) });
    //   })
    //   .catch(next);

    Promise.all([
      Employee.find().lean(),
      Employee.countDocumentsWithDeleted({ deleted: true }),
    ])
      .then(([employees, deletedCount]) =>
        res.json({
          deletedCount,
          employees,
        })
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
      .then((trashEmpolyee) => res.json({ trashEmpolyee }))
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
