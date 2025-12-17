const express = require("express");
const router = express.Router();

const EmployeeController = require("../app/controllers/EmployeeController.js");
const ProductController = require("../app/controllers/ProductController.js");
const CustomerController = require("../app/controllers/CustomerController.js");
const AccountController = require("../app/controllers/AccountController.js");
const PaymentController = require("../app/controllers/PaymentController.js");
const OrderController = require("../app/controllers/OrderController.js");

// -- Product --
router.get("/products", ProductController.showList);
router.get("/products/trash", ProductController.trashProduct);
router.post("/products/create", ProductController.create);
router.get("/products/:id", ProductController.edit);
router.put("/products/:id", ProductController.update);
router.delete("/products/:id", ProductController.deleteSoft);
router.delete("/products/:id/force", ProductController.delete);
router.patch("/products/:id/restore", ProductController.restore);

// -- Employee --
router.get("/employee", EmployeeController.show);
router.post("/employee/create", EmployeeController.create);
router.get("/employee/trash", EmployeeController.trashEmpolyee);
router.delete("/employee/trash/:id", EmployeeController.delete);
router.patch("/employee/trash/:id/restore", EmployeeController.restore);
router.get("/employee/:id", EmployeeController.edit);
router.put("/employee/:id", EmployeeController.update);
router.delete("/employee/:id", EmployeeController.deleteSoft);

// -- Customer --
router.get("/customers", CustomerController.show);
router.get("/customers/:id", CustomerController.edit);
router.put("/customers/:id", CustomerController.update);

// -- Account --
router.get("/account", AccountController.show);
router.post("/account/create", AccountController.create);
router.get("/account/:id", AccountController.edit);
router.post("/account/:id", AccountController.update);

// -- Order --
router.get("/orders", PaymentController.show);
router.get("/orders/count-pending", OrderController.countPending);
router.get("/orders/:id", PaymentController.showDetail);
router.put("/orders/:id", OrderController.updateStatus);
router.get("/orders/manage/:type", OrderController.showManage);

module.exports = router;
