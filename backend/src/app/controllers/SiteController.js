const Product = require("../models/Product");
const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class SiteController {
  //[GET] /
  index(req, res, next) {
    Product.find({ status: "New" })
      .lean()
      .then((newProduct) => {
        res.json({ newProduct });
      })
      .catch(next);
  }

  //[POST] /login
  async checkLogin(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your username and password.",
      });
    }

    try {
      const account = await Account.findOne({ user: username }).lean();

      if (!account) {
        return res.json({ success: false, message: "Account not found" });
      }

      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "The password you entered is incorrect",
        });
      }

      const Url = account.role === "admin" || account.role === "staff" ? "/dashboard" : "/";

      const payload = { id: account._id, user: account.user, role: account.role };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return res.status(200).json({
        id: account._id,
        role: account.role,
        success: true,
        message: "Login successful",
        redirectUrl: Url,
        user: account.user,
        accessToken,
        username: payload,
      });
    } catch (err) {
      next(err);
    }
  }
  // [POST] /register
  async register(req, res, next) {
    const { formData } = req.body;

    if (!formData)
      return res.status(400).json({ message: "Registration data is missing." });

    const { name, user, password } = formData;

    if (!name || !user || !password) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    try {
      const existingUser = await Account.findOne({ user }).lean();
      if (existingUser) {
        return res.status(400).json({ message: "This username is already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const account = new Account({ ...formData, password: hashedPassword });
      const savedAccount = await account.save();

      const payload = {
        id: savedAccount._id,
        name: savedAccount.name,
        user: savedAccount.user,
        role: savedAccount.role || "customer",
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.status(201).json({
        message: "Registration successful",
        accessToken,
        user: { id: savedAccount._id, name: savedAccount.name, user: savedAccount.user, role: savedAccount.role },
      });
    } catch (err) {
      next(err);
    }
  }

  //[GET] /search
  search(req, res, next) {
    const { value, page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const filter = { name: { $regex: value, $options: "i" } };

    Promise.all([
      Product.find(filter).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ])
      .then(([product, total]) => {
        res.json({
          product,
          total,
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
        });
      })
      .catch(next);
  }
}

module.exports = new SiteController();
