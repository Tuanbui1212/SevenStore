require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BRANDS = [
  { name: "Nike",        query: "giay nike",        limit: 8 },
  { name: "Adidas",      query: "giay adidas",      limit: 8 },
  { name: "Puma",        query: "giay puma",        limit: 6 },
  { name: "New Balance", query: "giay new balance", limit: 6 },
  { name: "Converse",    query: "giay converse",    limit: 4 },
];

const DEFAULT_SIZE = { "38": 5, "39": 8, "40": 12, "41": 12, "42": 8, "43": 5 };

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Referer: "https://tiki.vn/",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function cleanName(raw = "") {
  // Xoá tag dạng [Mã: xxx], [Chính hãng], ... ở đầu/cuối tên
  return raw.replace(/\[.*?\]/g, "").replace(/\s+/g, " ").trim();
}

function inferStatus(name = "") {
  const n = name.toLowerCase();
  if (n.includes("sale") || n.includes("giảm")) return "Sale";
  if (n.includes("new") || n.includes("mới")) return "New";
  if (n.includes("best") || n.includes("hot")) return "BestSeller";
  return "null";
}

async function crawlBrand(brand) {
  try {
    const res = await axios.get("https://tiki.vn/api/v2/products", {
      params: {
        q: brand.query,
        limit: brand.limit,
        sort: "top_seller",
        category: 4384, // Giày dép
      },
      headers: HEADERS,
      timeout: 12000,
    });

    const items = res.data?.data || [];
    if (!items.length) {
      console.warn(`   ⚠️  No results for ${brand.name}`);
      return [];
    }

    return items.slice(0, brand.limit).map((p) => {
      const name = cleanName(p.name) || `${brand.name} Sneaker`;
      const img = p.thumbnail_url || "";
      return {
        name,
        brand: brand.name,
        description:
          p.short_description?.trim() ||
          `${brand.name} premium sneaker — comfort and style for everyday wear.`,
        color: "various",
        status: inferStatus(name),
        cost: p.price || 1_500_000,
        image: { image1: img, image2: img, image3: img },
        size: { ...DEFAULT_SIZE },
      };
    });
  } catch (err) {
    if (err.response) {
      console.error(
        `   ❌ ${brand.name}: HTTP ${err.response.status} — ${err.response.data?.message || ""}`
      );
    } else {
      console.error(`   ❌ ${brand.name}: ${err.message}`);
    }
    return [];
  }
}

async function main() {
  console.log("🕷️  Tiki crawler starting...\n");

  const allProducts = [];

  for (const brand of BRANDS) {
    process.stdout.write(`📦 Crawling ${brand.name.padEnd(12)}... `);
    const products = await crawlBrand(brand);
    allProducts.push(...products);
    console.log(`got ${products.length} products`);

    // Polite delay between requests
    await sleep(1800);
  }

  if (!allProducts.length) {
    console.error("\n❌ No products crawled. Check your network / Tiki API.");
    process.exit(1);
  }

  const outPath = path.join(__dirname, "crawled-products.json");
  fs.writeFileSync(outPath, JSON.stringify(allProducts, null, 2), "utf-8");

  console.log(`\n✅ Crawled ${allProducts.length} products total`);
  console.log(`📄 Saved → src/crawled-products.json`);
  console.log(`\nNext step: npm run seed`);
}

main();
