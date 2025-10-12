const express = require("express");
const router = express.Router();
const cartController = require("../app/controllers/CartController");

router.post("/", cartController.addCart);
router.get("/", cartController.show);

module.exports = router;
