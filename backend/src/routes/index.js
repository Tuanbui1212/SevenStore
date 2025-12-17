const siteRouter = require("./site");
const productRouter = require("./product");
const dashboardRouter = require("./dashboard");
const accountRouter = require("./account");
const cartRouter = require("./cart");
const paymentRouter = require("./payment");
const myOrdersRouter = require("./myOrder");

//const authMiddleware = require("../app/middlewares/authMiddleware");

function route(app) {
  app.use("/dashboard", dashboardRouter);
  app.use("/product", productRouter);
  app.use("/account", accountRouter);
  app.use("/cart", cartRouter);
  app.use("/payment", paymentRouter);
  app.use("/my-orders", myOrdersRouter);
  app.use("/", siteRouter);
}

module.exports = route;
