require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const route = require("./routes");
const cors = require("cors");

const db = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["https://seven-store-steel.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

if (process.env.NODE_ENV !== "test") {
  db.connect();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = app;
