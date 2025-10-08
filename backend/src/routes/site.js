const express = require("express");
const router = express.Router();
const siteController = require("../app/controllers/SiteController.js");

router.post("/login", siteController.checkLogin);
router.get("/", siteController.index);

module.exports = router;
