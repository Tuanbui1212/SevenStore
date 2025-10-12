const siteRouter = require("./site");
const productRouter = require("./product");
const dashboardRouter = require("./dashboard");
const accountRouter = require("./account");
const cartRouter = require("./cart");

//const authMiddleware = require("../app/middlewares/authMiddleware");

function route(app) {
  app.use("/dashboard", dashboardRouter);
  app.use("/product", productRouter);
  app.use("/account", accountRouter);
  app.use("/cart", cartRouter);
  app.use("/", siteRouter);
}

module.exports = route;
