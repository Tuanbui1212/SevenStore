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

//app.use(cors());
app.use(
  cors({
    origin: "*", // Cho phép tất cả domain (test thử trước)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(morgan("combined"));

// Express doc duoc json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
