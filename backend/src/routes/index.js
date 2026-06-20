const siteRouter = require("./site");
const productRouter = require("./product");
const dashboardRouter = require("./dashboard");
const accountRouter = require("./account");
const cartRouter = require("./cart");
const paymentRouter = require("./payment");
const myOrdersRouter = require("./myOrder");

const authMiddleware = require("../app/middlewares/authMiddleware");
const requireAdminOrStaff = require("../app/middlewares/roleMiddleware");

function route(app) {
  // Public routes
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/", siteRouter);

  // Auth required (any logged-in user)
  app.use("/payment", authMiddleware, paymentRouter);
  app.use("/my-orders", authMiddleware, myOrdersRouter);
  app.use("/account", authMiddleware, accountRouter);

  // Auth + admin/staff role required
  app.use("/dashboard", authMiddleware, requireAdminOrStaff, dashboardRouter);
}

module.exports = route;
