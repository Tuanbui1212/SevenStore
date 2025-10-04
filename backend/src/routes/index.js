const siteRouter = require("./site");
const productRouter = require("./product");
const dashboardRouter = require("./dashboard");

function route(app) {
  
  app.use("/dashboard", dashboardRouter);
  app.use("/product", productRouter);
  app.use("/", siteRouter);
}

module.exports = route;
