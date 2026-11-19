const express = require("express");
const router = express.Router();

const OrderController = require("../app/controllers/OrderController");

router.get("/", OrderController.showByUser);
router.put("/:id/status", OrderController.customerUpdateStatus);

module.exports = router;
