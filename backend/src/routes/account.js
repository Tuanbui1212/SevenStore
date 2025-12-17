const express = require("express");
const router = express.Router();
const accountController = require("../app/controllers/AccountController");

router.get("/:id", accountController.showInformation);
router.put("/:id", accountController.updatePassword);

module.exports = router;
