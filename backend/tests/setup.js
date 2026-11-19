require("dotenv").config();
process.env.NODE_ENV = "test";
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "default_test_secret";

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Account = require("../src/app/models/Account");
const Product = require("../src/app/models/Product");

let mongoServer;

const setupDB = () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });
};

const createTestUser = async ({ user = "testuser", password = "password123", role = "customer", name = "Test User" } = {}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const account = await Account.create({
    user,
    password: hashedPassword,
    role,
    name,
    cart: [],
  });

  const token = jwt.sign(
    { id: account._id, user: account.user, role: account.role },
    process.env.ACCESS_TOKEN_SECRET || JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { account, token, rawPassword: password };
};

const createTestProduct = async (overrides = {}) => {
  const defaultProduct = {
    name: "Nike Air Max 90",
    brand: "Nike",
    description: "Classic sneaker",
    color: "white",
    cost: 2500000,
    status: "New",
    size: { "38": 5, "39": 10, "40": 15, "41": 10, "42": 5 },
    image: { image1: "https://example.com/nike.jpg" },
  };

  return await Product.create({ ...defaultProduct, ...overrides });
};

module.exports = {
  setupDB,
  createTestUser,
  createTestProduct,
};
