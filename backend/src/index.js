const express = require("express");
var morgan = require("morgan");
const route = require("./routes");

const cors = require("cors"); // Bắt
require("dotenv").config();

const db = require("./config/db");
db.connect();

const app = express();
const port = process.env.PORT || 5000; //Sửa như này để config vơi front end
//const port = 5000;

app.use(morgan("combined"));
app.use(cors());

// Express doc duoc json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
