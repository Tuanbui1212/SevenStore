const express = require("express");
const router = express.Router();

const EmployeeController = require("../app/controllers/EmployeeController.js");
const ProductController = require("../app/controllers/ProductController.js");

router.get("/products", ProductController.showList);
router.get("/products/trash", ProductController.trashProduct);
router.post("/products/create", ProductController.create);
router.delete("/products/trash/:id", ProductController.delete);
router.get("/products/:id", ProductController.edit);
router.put("/products/:id", ProductController.update);
router.delete("/products/trash/:id/restore", ProductController.deleteSoft);
router.patch("/products/:id/restore", ProductController.restore);

router.post("/employee/create", EmployeeController.create);
router.get("/employee/trash", EmployeeController.trashEmpolyee);
router.delete("/employee/trash/:id", EmployeeController.delete);
router.patch("/employee/trash/:id/restore", EmployeeController.restore);
router.get("/employee/:id", EmployeeController.edit);
router.put("/employee/:id", EmployeeController.update);
router.delete("/employee/:id", EmployeeController.deleteSoft);
router.get("/employee", EmployeeController.show);

module.exports = router;
