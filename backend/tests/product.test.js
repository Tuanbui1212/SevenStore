const request = require("supertest");
const app = require("../src/index");
const { setupDB, createTestUser, createTestProduct } = require("./setup");
const Product = require("../src/app/models/Product");

setupDB();

describe("Product Catalog & Search API", () => {
  beforeEach(async () => {
    await createTestProduct({
      name: "Nike Air Force 1",
      brand: "Nike",
      cost: 2200000,
      color: "white",
      status: "New",
      size: { "38": 5, "39": 10 },
    });
    await createTestProduct({
      name: "Adidas Ultraboost 22",
      brand: "Adidas",
      cost: 3500000,
      color: "black",
      status: "BestSeller",
      size: { "40": 8, "41": 12 },
    });
    await createTestProduct({
      name: "Puma Suede Classic",
      brand: "Puma",
      cost: 1800000,
      color: "red",
      status: "sale",
      size: { "39": 4, "40": 6 },
    });
  });

  describe("Public Product Endpoints", () => {
    it("should fetch products by brand", async () => {
      const res = await request(app).get("/product/Nike");
      expect(res.status).toBe(200);
      expect(res.body.newProduct).toHaveLength(1);
      expect(res.body.newProduct[0].name).toBe("Nike Air Force 1");
    });

    it("should fetch all products when brand is 'all'", async () => {
      const res = await request(app).get("/product/all");
      expect(res.status).toBe(200);
      expect(res.body.total).toBe(3);
    });

    it("should filter products by price range", async () => {
      const res = await request(app).get("/product/all?min=2000000&max=3000000");
      expect(res.status).toBe(200);
      expect(res.body.newProduct).toHaveLength(1);
      expect(res.body.newProduct[0].name).toBe("Nike Air Force 1");
    });

    it("should filter products by color", async () => {
      const res = await request(app).get("/product/all?color=black");
      expect(res.status).toBe(200);
      expect(res.body.newProduct).toHaveLength(1);
      expect(res.body.newProduct[0].brand).toBe("Adidas");
    });

    it("should get product detail by slug", async () => {
      const nike = await Product.findOne({ brand: "Nike" });
      const res = await request(app).get(`/product/Nike/${nike.slug}`);
      expect(res.status).toBe(200);
      expect(res.body.productDetail).toBeDefined();
      expect(res.body.productDetail.name).toBe("Nike Air Force 1");
    });

    it("should return 404 for non-existent product slug", async () => {
      const res = await request(app).get("/product/Nike/non-existent-product-slug-12345");
      expect(res.status).toBe(404);
    });

    it("should search products by keyword", async () => {
      const res = await request(app).get("/search?value=Ultraboost");
      expect(res.status).toBe(200);
      expect(res.body.product).toHaveLength(1);
      expect(res.body.product[0].name).toContain("Ultraboost");
    });
  });

  describe("Admin Product Management (/dashboard/products)", () => {
    it("should require admin or staff role to create a product", async () => {
      const { token: customerToken } = await createTestUser({ role: "customer" });
      const res = await request(app)
        .post("/dashboard/products/create")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ name: "Hacker Product" });

      expect(res.status).toBe(403);
    });

    it("should allow admin to create a new product", async () => {
      const { token: adminToken } = await createTestUser({ role: "admin", user: "admin1" });
      const res = await request(app)
        .post("/dashboard/products/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Converse Chuck 70 High",
          brand: "Converse",
          description: "Vintage canvas sneaker",
          color: "black",
          cost: 1500000,
          status: "New",
          size: { "38": 5, "39": 5 },
        });

      expect(res.status).toBe(201);
      const created = await Product.findOne({ name: "Converse Chuck 70 High" });
      expect(created).not.toBeNull();
    });

    it("should allow admin to soft delete and restore a product", async () => {
      const { token: adminToken } = await createTestUser({ role: "admin", user: "admin2" });
      const product = await Product.findOne({ brand: "Puma" });

      // Soft delete
      const delRes = await request(app)
        .delete(`/dashboard/products/${product._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(delRes.status).toBe(200);

      // Verify it doesn't appear in normal public listing
      const publicRes = await request(app).get("/product/Puma");
      expect(publicRes.body.newProduct).toHaveLength(0);

      // Verify it appears in trash
      const trashRes = await request(app)
        .get("/dashboard/products/trash")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(trashRes.status).toBe(200);
      expect(trashRes.body.trashProducts.some((p) => p._id.toString() === product._id.toString())).toBe(true);

      // Restore
      const restoreRes = await request(app)
        .patch(`/dashboard/products/${product._id}/restore`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(restoreRes.status).toBe(200);

      // Public listing shows product again
      const restoredPublicRes = await request(app).get("/product/Puma");
      expect(restoredPublicRes.body.newProduct).toHaveLength(1);
    });
  });
});

