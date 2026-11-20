const express = require("express");
const router = express.Router();
const siteController = require("../app/controllers/SiteController.js");
const mongoose = require("mongoose");

// Health Check endpoint for ProjectManager & Keep-Alive monitoring
const healthHandler = (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  return res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? "ok" : "degraded",
    service: "SeventStore-Backend",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      provider: "mongodb",
      status: isDbConnected ? "connected" : "disconnected",
    },
    memory: {
      heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  });
};

router.get("/api/health", healthHandler);
router.get("/health", healthHandler);

router.post("/login", siteController.checkLogin);
router.post("/register", siteController.register);
router.get("/search", siteController.search);
router.get("/", siteController.index);

module.exports = router;
