require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const Product = require("./app/models/Product");
const Account = require("./app/models/Account");
const Employees = require("./app/models/Employees");
const Customer = require("./app/models/Customer");
const Order = require("./app/models/Order");
const Promotion = require("./app/models/Promotion");

// img() - placeholder ảnh sản phẩm (bg = hex color không có #)
function img(label, bg = "111111") {
  return `https://placehold.co/500x500/${bg}/ffffff?text=${encodeURIComponent(label)}`;
}

// Load crawled products if available, else fall back to hardcoded PRODUCTS
const CRAWLED_PATH = path.join(__dirname, "crawled-products.json");
let USE_CRAWLED = false;
let CRAWLED_PRODUCTS = [];
if (fs.existsSync(CRAWLED_PATH)) {
  CRAWLED_PRODUCTS = JSON.parse(fs.readFileSync(CRAWLED_PATH, "utf-8"));
  USE_CRAWLED = true;
  console.log(`🖼️  Found crawled-products.json — will use ${CRAWLED_PRODUCTS.length} real products`);
}

// Stock mỗi size giày
const S = { "38": 5, "39": 8, "40": 12, "41": 12, "42": 8, "43": 5 };

// ─────────────────────────────────────────────
//  PRODUCTS (30 sản phẩm, 5 thương hiệu)
// ─────────────────────────────────────────────
const PRODUCTS = [
  // ── NIKE ──────────────────────────────────
  {
    name: "Nike Air Force 1 Low", brand: "Nike",
    description: "Iconic white leather silhouette, versatile for all outfits.",
    color: "white", status: "New", cost: 2000000,
    image: { image1: img("AF1 Low","f5f5f5"), image2: img("AF1 Side","eeeeee"), image3: img("AF1 Back","e0e0e0") },
    size: S,
  },
  {
    name: "Nike Air Jordan 1 High OG", brand: "Nike",
    description: "The original basketball legend. High-top with premium leather.",
    color: "red", status: "BestSeller", cost: 4500000,
    image: { image1: img("Jordan 1","c62828"), image2: img("J1 Side","b71c1c"), image3: img("J1 Back","d32f2f") },
    size: S,
  },
  {
    name: "Nike Air Max 90", brand: "Nike",
    description: "Classic Air cushioning meets retro style. Timeless design.",
    color: "gray", status: "Sale", cost: 2800000,
    image: { image1: img("Air Max 90","757575"), image2: img("AM90 Side","616161"), image3: img("AM90 Back","424242") },
    size: S,
  },
  {
    name: "Nike Dunk Low", brand: "Nike",
    description: "Born on the basketball court, lived in the streets.",
    color: "blue", status: "New", cost: 2500000,
    image: { image1: img("Dunk Low","1565c0"), image2: img("Dunk Side","0d47a1"), image3: img("Dunk Back","1a237e") },
    size: S,
  },
  {
    name: "Nike Air Max 97", brand: "Nike",
    description: "Futuristic running design inspired by the Japanese bullet train.",
    color: "black", status: "BestSeller", cost: 3200000,
    image: { image1: img("Air Max 97","212121"), image2: img("AM97 Side","1a1a1a"), image3: img("AM97 Back","111111") },
    size: S,
  },
  {
    name: "Nike Blazer Mid 77", brand: "Nike",
    description: "Vintage basketball style with a modern clean look.",
    color: "white", status: "null", cost: 2200000,
    image: { image1: img("Blazer Mid","fafafa"), image2: img("BM Side","f5f5f5"), image3: img("BM Back","eeeeee") },
    size: S,
  },
  {
    name: "Nike React Element 55", brand: "Nike",
    description: "Lightweight React foam delivers ultra-soft cushioning.",
    color: "orange", status: "Sale", cost: 1800000,
    image: { image1: img("React 55","e64a19"), image2: img("RE Side","bf360c"), image3: img("RE Back","f4511e") },
    size: S,
  },
  {
    name: "Nike Air Pegasus 39", brand: "Nike",
    description: "Trusted daily trainer with responsive cushioning.",
    color: "black", status: "New", cost: 2600000,
    image: { image1: img("Pegasus 39","263238"), image2: img("Peg Side","212121"), image3: img("Peg Back","1a1a1a") },
    size: S,
  },
  // ── ADIDAS ────────────────────────────────
  {
    name: "Adidas Ultraboost 22", brand: "Adidas",
    description: "Energy-returning Boost midsole for maximum performance.",
    color: "white", status: "BestSeller", cost: 3500000,
    image: { image1: img("Ultraboost","f5f5f5"), image2: img("UB Side","eeeeee"), image3: img("UB Back","e0e0e0") },
    size: S,
  },
  {
    name: "Adidas Stan Smith", brand: "Adidas",
    description: "The clean and classic tennis shoe that started it all.",
    color: "white", status: "New", cost: 1800000,
    image: { image1: img("Stan Smith","fafafa"), image2: img("SS Side","f5f5f5"), image3: img("SS Back","eeeeee") },
    size: S,
  },
  {
    name: "Adidas NMD R1", brand: "Adidas",
    description: "Boost technology meets a sleek street-ready silhouette.",
    color: "black", status: "Sale", cost: 2800000,
    image: { image1: img("NMD R1","1a1a1a"), image2: img("NMD Side","212121"), image3: img("NMD Back","111111") },
    size: S,
  },
  {
    name: "Adidas Superstar", brand: "Adidas",
    description: "The legendary shell-toe sneaker with iconic 3-Stripes.",
    color: "white", status: "BestSeller", cost: 1600000,
    image: { image1: img("Superstar","fafafa"), image2: img("SS2 Side","f0f0f0"), image3: img("SS2 Back","e5e5e5") },
    size: S,
  },
  {
    name: "Adidas Yeezy Boost 350 V2", brand: "Adidas",
    description: "Kanye West collab. Full-length Boost, Primeknit upper.",
    color: "yellow", status: "BestSeller", cost: 5000000,
    image: { image1: img("Yeezy 350","f9a825"), image2: img("YZ Side","f57f17"), image3: img("YZ Back","ff8f00") },
    size: S,
  },
  {
    name: "Adidas Forum Low", brand: "Adidas",
    description: "90s basketball heritage with bold 3-Stripes branding.",
    color: "blue", status: "New", cost: 2200000,
    image: { image1: img("Forum Low","1565c0"), image2: img("FL Side","0d47a1"), image3: img("FL Back","1a237e") },
    size: S,
  },
  {
    name: "Adidas Gazelle", brand: "Adidas",
    description: "Suede upper with classic 3-Stripes. A true icon.",
    color: "green", status: "null", cost: 1700000,
    image: { image1: img("Gazelle","2e7d32"), image2: img("Gaz Side","1b5e20"), image3: img("Gaz Back","388e3c") },
    size: S,
  },
  {
    name: "Adidas Samba OG", brand: "Adidas",
    description: "The indoor soccer shoe reborn as a street style staple.",
    color: "black", status: "New", cost: 2400000,
    image: { image1: img("Samba OG","212121"), image2: img("Samba Side","1a1a1a"), image3: img("Samba Back","111111") },
    size: S,
  },
  // ── PUMA ──────────────────────────────────
  {
    name: "Puma Suede Classic", brand: "Puma",
    description: "A timeless suede silhouette worn by legends.",
    color: "brown", status: "null", cost: 1500000,
    image: { image1: img("Suede Classic","6d4c41"), image2: img("SC Side","5d4037"), image3: img("SC Back","4e342e") },
    size: S,
  },
  {
    name: "Puma RS-X", brand: "Puma",
    description: "Running System technology with exaggerated chunky sole.",
    color: "red", status: "Sale", cost: 1800000,
    image: { image1: img("RS-X","c62828"), image2: img("RSX Side","b71c1c"), image3: img("RSX Back","d32f2f") },
    size: S,
  },
  {
    name: "Puma Clyde All Pro", brand: "Puma",
    description: "Basketball-inspired silhouette with clean styling.",
    color: "black", status: "New", cost: 2100000,
    image: { image1: img("Clyde Pro","1a1a1a"), image2: img("CP Side","212121"), image3: img("CP Back","111111") },
    size: S,
  },
  {
    name: "Puma Cell Venom", brand: "Puma",
    description: "Futuristic cell cushioning technology in a bold design.",
    color: "gray", status: "null", cost: 1600000,
    image: { image1: img("Cell Venom","616161"), image2: img("CV Side","757575"), image3: img("CV Back","424242") },
    size: S,
  },
  {
    name: "Puma Rider FV", brand: "Puma",
    description: "Vintage running aesthetic with modern comfort.",
    color: "orange", status: "Sale", cost: 1700000,
    image: { image1: img("Rider FV","e64a19"), image2: img("RFV Side","bf360c"), image3: img("RFV Back","f4511e") },
    size: S,
  },
  // ── NEW BALANCE ───────────────────────────
  {
    name: "New Balance 574", brand: "New Balance",
    description: "All-day comfort with ENCAP midsole technology.",
    color: "gray", status: "BestSeller", cost: 2000000,
    image: { image1: img("NB 574","757575"), image2: img("574 Side","616161"), image3: img("574 Back","424242") },
    size: S,
  },
  {
    name: "New Balance 990v5", brand: "New Balance",
    description: "Made in USA. Premium ENCAP + C-CAP cushioning.",
    color: "gray", status: "BestSeller", cost: 4500000,
    image: { image1: img("NB 990v5","616161"), image2: img("990 Side","757575"), image3: img("990 Back","424242") },
    size: S,
  },
  {
    name: "New Balance 327", brand: "New Balance",
    description: "70s running-inspired silhouette with a modern retro look.",
    color: "white", status: "New", cost: 2200000,
    image: { image1: img("NB 327","fafafa"), image2: img("327 Side","f5f5f5"), image3: img("327 Back","eeeeee") },
    size: S,
  },
  {
    name: "New Balance 550", brand: "New Balance",
    description: "Retro basketball style from 1989, reimagined.",
    color: "white", status: "New", cost: 2400000,
    image: { image1: img("NB 550","f5f5f5"), image2: img("550 Side","fafafa"), image3: img("550 Back","eeeeee") },
    size: S,
  },
  {
    name: "New Balance 57/40", brand: "New Balance",
    description: "Future-inspired design combining archive running styles.",
    color: "black", status: "null", cost: 2100000,
    image: { image1: img("NB 5740","1a1a1a"), image2: img("5740 Side","212121"), image3: img("5740 Back","111111") },
    size: S,
  },
  // ── CONVERSE ──────────────────────────────
  {
    name: "Converse Chuck Taylor All Star High", brand: "Converse",
    description: "The original high-top canvas sneaker. An American icon.",
    color: "white", status: "BestSeller", cost: 1200000,
    image: { image1: img("Chuck High","fafafa"), image2: img("CT Side","f5f5f5"), image3: img("CT Back","eeeeee") },
    size: S,
  },
  {
    name: "Converse Run Star Hike", brand: "Converse",
    description: "Platform sole meets Chuck Taylor classic upper.",
    color: "black", status: "New", cost: 1800000,
    image: { image1: img("Run Star","1a1a1a"), image2: img("RSH Side","212121"), image3: img("RSH Back","111111") },
    size: S,
  },
  {
    name: "Converse One Star Pro", brand: "Converse",
    description: "Suede upper with star logo. A skate classic.",
    color: "blue", status: "Sale", cost: 1500000,
    image: { image1: img("One Star","1565c0"), image2: img("OSP Side","0d47a1"), image3: img("OSP Back","1a237e") },
    size: S,
  },
  {
    name: "Converse Pro Leather", brand: "Converse",
    description: "Premium leather upper with OG basketball detailing.",
    color: "white", status: "null", cost: 1400000,
    image: { image1: img("Pro Leather","f5f5f5"), image2: img("PL Side","fafafa"), image3: img("PL Back","eeeeee") },
    size: S,
  },
];

// ─────────────────────────────────────────────
//  ACCOUNTS
// ─────────────────────────────────────────────
const ACCOUNTS = [
  { name: "Administrator",    user: "admin",  password: "admin123",  role: "admin",    cart: [] },
  { name: "Staff Member",     user: "staff1", password: "staff123",  role: "staff",    cart: [] },
  { name: "Nguyễn Minh Tuấn",user: "user1",  password: "user123",   role: "customer", cart: [] },
  { name: "Trần Thị Lan",     user: "user2",  password: "user123",   role: "customer", cart: [] },
  { name: "Lê Văn Hùng",      user: "user3",  password: "user123",   role: "customer", cart: [] },
];

// ─────────────────────────────────────────────
//  EMPLOYEES
// ─────────────────────────────────────────────
const EMPLOYEES = [
  { name: "Nguyễn Văn An",  status: "active",   role: "manager", date: new Date("2022-01-15") },
  { name: "Trần Thị Bình",  status: "active",   role: "staff",   date: new Date("2022-03-20") },
  { name: "Lê Văn Cường",   status: "active",   role: "staff",   date: new Date("2022-06-10") },
  { name: "Phạm Thị Dung",  status: "inactive", role: "staff",   date: new Date("2021-11-05") },
  { name: "Hoàng Văn Em",   status: "active",   role: "staff",   date: new Date("2023-01-08") },
  { name: "Vũ Thị Phương",  status: "active",   role: "manager", date: new Date("2021-07-22") },
];

// ─────────────────────────────────────────────
//  CUSTOMERS
// ─────────────────────────────────────────────
const CUSTOMERS = [
  { name: "Nguyễn Minh Tuấn", status: "active",   phone: 912345678, address: "123 Nguyễn Trãi, Hà Nội" },
  { name: "Trần Thị Lan",     status: "active",   phone: 987654321, address: "456 Lê Lợi, TP.HCM" },
  { name: "Lê Văn Hùng",      status: "active",   phone: 934567890, address: "789 Trần Phú, Đà Nẵng" },
  { name: "Phạm Thị Mai",     status: "inactive", phone: 923456789, address: "321 Hoàng Diệu, Hải Phòng" },
  { name: "Bùi Văn Nam",      status: "active",   phone: 956789012, address: "654 Nguyễn Huệ, Cần Thơ" },
];

// ─────────────────────────────────────────────
//  PROMOTIONS
// ─────────────────────────────────────────────
const PROMOTIONS = [
  {
    code: "SUMMER20", name: "Summer Sale 20%",
    description: "Giảm 20% cho đơn từ 500k", type: "percent",
    value: 20, maxDiscountAmount: 500000, minOrderValue: 500000,
    startDate: new Date("2024-06-01"), endDate: new Date("2024-08-31"),
    isActive: true, usageLimit: 100,
  },
  {
    code: "NEWUSER", name: "Ưu đãi khách hàng mới",
    description: "Giảm 100.000đ cho đơn đầu tiên", type: "fixed",
    value: 100000, minOrderValue: 0,
    startDate: new Date("2024-01-01"), endDate: new Date("2026-12-31"),
    isActive: true, usageLimit: null, usageLimitPerUser: 1,
  },
  {
    code: "FLASH50", name: "Flash Sale 50%",
    description: "Giảm 50% tối đa 500k", type: "percent",
    value: 50, maxDiscountAmount: 500000, minOrderValue: 1000000,
    startDate: new Date("2024-11-11"), endDate: new Date("2024-11-11"),
    isActive: false, usageLimit: 50, usageCount: 50,
  },
  {
    code: "WELCOME", name: "Chào mừng khách hàng",
    description: "Giảm 5% mọi đơn hàng", type: "percent",
    value: 5, minOrderValue: 0,
    startDate: new Date("2024-01-01"), endDate: new Date("2026-12-31"),
    isActive: true, usageLimit: null,
  },
];

// ─────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────
async function seed() {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1/SevenStore";
  await mongoose.connect(mongoURI);
  console.log("✅ Connected to MongoDB:", mongoURI.split("@").pop());

  // Xóa toàn bộ dữ liệu cũ (bypass soft-delete plugin)
  await Promise.all([
    Product.collection.deleteMany({}),
    Account.collection.deleteMany({}),
    Employees.collection.deleteMany({}),
    Customer.collection.deleteMany({}),
    Order.collection.deleteMany({}),
    Promotion.collection.deleteMany({}),
  ]);
  console.log("🗑  Cleared all collections");

  // Products: save từng cái để trigger slug generation middleware
  const PRODUCTS_TO_INSERT = USE_CRAWLED ? CRAWLED_PRODUCTS : PRODUCTS;
  const products = [];
  for (const data of PRODUCTS_TO_INSERT) {
    const doc = await new Product(data).save();
    products.push(doc);
  }
  console.log(`📦 Inserted ${products.length} products`);

  // Hash passwords trước khi insert
  const hashedAccounts = await Promise.all(
    ACCOUNTS.map(async (acc) => ({
      ...acc,
      password: await bcrypt.hash(acc.password, 10),
    }))
  );
  await Account.insertMany(hashedAccounts);
  console.log(`👤 Inserted ${ACCOUNTS.length} accounts`);

  await Employees.insertMany(EMPLOYEES);
  console.log(`👷 Inserted ${EMPLOYEES.length} employees`);

  await Customer.insertMany(CUSTOMERS);
  console.log(`🧑 Inserted ${CUSTOMERS.length} customers`);

  await Promotion.insertMany(PROMOTIONS);
  console.log(`🎟  Inserted ${PROMOTIONS.length} promotions`);

  // Orders: tham chiếu productId từ products đã insert
  const item = (idx, size, qty) => ({
    productId: products[idx]._id,
    size,
    quantity: qty,
    price: products[idx].cost,
  });

  const ORDERS = [
    {
      user: "user1", name: "Nguyễn Minh Tuấn", phone: "0912345678",
      email: "user1@example.com", address: "123 Nguyễn Trãi", city: "Hà Nội",
      paymentMethod: "COD", status: "Delivered",
      items: [item(0, "41", 1), item(8, "42", 1)],
      totalPrice: products[0].cost + products[8].cost,
      createdAt: new Date("2024-09-05"),
    },
    {
      user: "user1", name: "Nguyễn Minh Tuấn", phone: "0912345678",
      email: "user1@example.com", address: "123 Nguyễn Trãi", city: "Hà Nội",
      paymentMethod: "Banking", status: "Shipping",
      items: [item(12, "40", 1)],
      totalPrice: products[12].cost,
      createdAt: new Date("2024-11-20"),
    },
    {
      user: "user1", name: "Nguyễn Minh Tuấn", phone: "0912345678",
      email: "user1@example.com", address: "123 Nguyễn Trãi", city: "Hà Nội",
      paymentMethod: "COD", status: "Pending",
      items: [item(3, "41", 1), item(15, "41", 1)],
      totalPrice: products[3].cost + products[15].cost,
      createdAt: new Date("2024-12-10"),
    },
    {
      user: "user2", name: "Trần Thị Lan", phone: "0987654321",
      email: "user2@example.com", address: "456 Lê Lợi", city: "TP.HCM",
      paymentMethod: "COD", status: "Delivered",
      items: [item(9, "38", 1), item(25, "38", 2)],
      totalPrice: products[9].cost + products[25].cost * 2,
      createdAt: new Date("2024-09-15"),
    },
    {
      user: "user2", name: "Trần Thị Lan", phone: "0987654321",
      email: "user2@example.com", address: "456 Lê Lợi", city: "TP.HCM",
      paymentMethod: "COD", status: "Cancelled",
      items: [item(1, "39", 1)],
      totalPrice: products[1].cost,
      createdAt: new Date("2024-10-28"),
    },
    {
      user: "user2", name: "Trần Thị Lan", phone: "0987654321",
      email: "user2@example.com", address: "456 Lê Lợi", city: "TP.HCM",
      paymentMethod: "Banking", status: "Shipping",
      items: [item(13, "40", 1)],
      totalPrice: products[13].cost,
      createdAt: new Date("2024-11-28"),
    },
    {
      user: "user3", name: "Lê Văn Hùng", phone: "0934567890",
      email: "user3@example.com", address: "789 Trần Phú", city: "Đà Nẵng",
      paymentMethod: "Banking", status: "Pending",
      items: [item(4, "42", 1), item(21, "42", 1)],
      totalPrice: products[4].cost + products[21].cost,
      createdAt: new Date("2024-12-01"),
    },
    {
      user: "user3", name: "Lê Văn Hùng", phone: "0934567890",
      email: "user3@example.com", address: "789 Trần Phú", city: "Đà Nẵng",
      paymentMethod: "COD", status: "Delivered",
      items: [item(11, "41", 1)],
      totalPrice: products[11].cost,
      createdAt: new Date("2024-08-10"),
    },
    {
      user: "user3", name: "Lê Văn Hùng", phone: "0934567890",
      email: "user3@example.com", address: "789 Trần Phú", city: "Đà Nẵng",
      paymentMethod: "COD", status: "Delivered",
      items: [item(20, "40", 1), item(23, "40", 1)],
      totalPrice: products[20].cost + products[23].cost,
      createdAt: new Date("2024-07-22"),
    },
    {
      user: "user1", name: "Nguyễn Minh Tuấn", phone: "0912345678",
      email: "user1@example.com", address: "123 Nguyễn Trãi", city: "Hà Nội",
      paymentMethod: "COD", status: "Delivered",
      items: [item(22, "41", 1), item(2, "41", 1)],
      totalPrice: products[22].cost + products[2].cost,
      createdAt: new Date("2024-06-14"),
    },
  ];

  await Order.insertMany(ORDERS);
  console.log(`🛒 Inserted ${ORDERS.length} orders`);

  await mongoose.disconnect();

  console.log("\n✅ Seed hoàn tất!");
  console.log("─────────────────────────────────");
  console.log(`  Products   : ${products.length}`);
  console.log(`  Accounts   : ${ACCOUNTS.length}`);
  console.log(`  Employees  : ${EMPLOYEES.length}`);
  console.log(`  Customers  : ${CUSTOMERS.length}`);
  console.log(`  Orders     : ${ORDERS.length}`);
  console.log(`  Promotions : ${PROMOTIONS.length}`);
  console.log("─────────────────────────────────");
  console.log("📌 Tài khoản đăng nhập:");
  console.log("  admin  / admin123  → Dashboard (admin)");
  console.log("  staff1 / staff123  → Dashboard (staff)");
  console.log("  user1  / user123   → Khách hàng");
  console.log("  user2  / user123   → Khách hàng");
  console.log("  user3  / user123   → Khách hàng");
}

seed().catch((err) => {
  console.error("❌ Seed thất bại:", err.message);
  process.exit(1);
});
