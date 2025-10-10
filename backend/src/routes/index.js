const siteRouter = require("./site");
const productRouter = require("./product");
const dashboardRouter = require("./dashboard");

//const authMiddleware = require("../app/middlewares/authMiddleware");

function route(app) {
  app.use("/dashboard", dashboardRouter);
  app.use("/product", productRouter);
  app.use("/", siteRouter);
}

module.exports = route;
