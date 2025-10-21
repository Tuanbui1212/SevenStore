const express = require("express");
const router = express.Router();

const paymentController = require("../app/controllers/PaymentController");

router.post("/", paymentController.create);
//router.get("/", paymentController.show);

module.exports = router;
