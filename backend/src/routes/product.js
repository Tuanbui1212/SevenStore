const express = require("express");
const router = express.Router();

const productController = require("../app/controllers/ProductController");


router.get("/:brand", productController.show);

module.exports = router;
