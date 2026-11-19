const request = require("supertest");
const app = require("../src/index");
const { setupDB, createTestUser, createTestProduct } = require("./setup");
const Product = require("../src/app/models/Product");
const Order = require("../src/app/models/Order");

setupDB();

describe("Order Placement, Inventory & Lifecycle API", () => {
  let customer, product;

  beforeEach(async () => {
    customer = await createTestUser({ user: "buyer1", role: "customer" });
    product = await createTestProduct({
      name: "Jordan 1 Retro",
      cost: 3000000,
      size: { "42": 4 },
    });
  });

  describe("Checkout & Order Creation (/payment)", () => {
    it("should successfully place an order and deduct stock atomically", async () => {
      const res = await request(app)
        .post("/payment")
        .set("Authorization", `Bearer ${customer.token}`)
        .send({
          formData: {
            name: "Buyer One",
            phone: "0901234567",
            email: "buyer@example.com",
            address: "123 Street",
            city: "Ho Chi Minh",
            payment: "ShipCod",
          },
          checkedItems: [
            {
              id: product._id.toString(),
              size: "42",
              quantity: 2,
              cost: 3000000,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("orderId");

      // Verify stock deducted from 4 to 2
      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct.size["42"]).toBe(2);

      // Verify Order document created
      const order = await Order.findById(res.body.orderId);
      expect(order).not.toBeNull();
      expect(order.status).toBe("Pending");
      // Total price = (3000000 * 2) + 30000 shipping = 6030000
      expect(order.totalPrice).toBe(6030000);
    });

    it("should reject checkout when stock is insufficient", async () => {
      const res = await request(app)
        .post("/payment")
        .set("Authorization", `Bearer ${customer.token}`)
        .send({
          formData: {
            name: "Greedy Buyer",
            phone: "0909999999",
            email: "greedy@example.com",
            city: "Hanoi",
            address: "Nowhere",
          },
          checkedItems: [
            {
              id: product._id.toString(),
              size: "42",
              quantity: 10, // Available is only 4
              cost: 3000000,
            },
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/insufficient stock/i);

      // Stock should remain untouched
      const untouchedProduct = await Product.findById(product._id);
      expect(untouchedProduct.size["42"]).toBe(4);
    });

    it("should generate VNPay payment URL when payment method is VnPay", async () => {
      const res = await request(app)
        .post("/payment")
        .set("Authorization", `Bearer ${customer.token}`)
        .send({
          formData: {
            name: "VNPay Buyer",
            phone: "0911223344",
            email: "vnpay@example.com",
            city: "Danang",
            address: "Payment St",
            payment: "VnPay",
          },
          checkedItems: [
            {
              id: product._id.toString(),
              size: "42",
              quantity: 1,
              cost: 3000000,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.url).toContain("vnpayment.vn");
      expect(res.body.url).toContain("vnp_SecureHash");
    });
  });

  describe("Customer Order Self-Service (/my-orders)", () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        user: customer.account.user,
        name: "Buyer One",
        phone: "0901234567",
        email: "buyer@example.com",
        city: "Ho Chi Minh",
        address: "123 Street",
        paymentMethod: "ShipCod",
        totalPrice: 3030000,
        status: "Pending",
        items: [
          {
            productId: product._id,
            size: "42",
            quantity: 1,
            price: 3000000,
          },
        ],
      });
      // Deduct stock for the order
      product.size["42"] = 3;
      product.markModified("size");
      await product.save();
    });

    it("should allow a customer to view their own orders", async () => {
      const res = await request(app)
        .get("/my-orders")
        .set("Authorization", `Bearer ${customer.token}`);

      expect(res.status).toBe(200);
      expect(res.body.order).toHaveLength(1);
      expect(res.body.order[0]._id.toString()).toBe(order._id.toString());
    });

    it("should allow customer to cancel a Pending order and restore stock", async () => {
      const res = await request(app)
        .put(`/my-orders/${order._id}/status`)
        .set("Authorization", `Bearer ${customer.token}`)
        .send({ status: "Cancelled" });

      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe("Cancelled");

      // Verify stock was restored from 3 back to 4
      const restoredProduct = await Product.findById(product._id);
      expect(restoredProduct.size["42"]).toBe(4);
    });

    it("should prevent customer from cancelling an order that is already Shipping", async () => {
      order.status = "Shipping";
      await order.save();

      const res = await request(app)
        .put(`/my-orders/${order._id}/status`)
        .set("Authorization", `Bearer ${customer.token}`)
        .send({ status: "Cancelled" });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/cannot cancel/i);
    });
  });
});
