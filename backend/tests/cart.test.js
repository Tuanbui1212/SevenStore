const request = require("supertest");
const app = require("../src/index");
const { setupDB, createTestUser, createTestProduct } = require("./setup");
const Account = require("../src/app/models/Account");

setupDB();

describe("Shopping Cart API (/cart)", () => {
  let userObj, productObj;

  beforeEach(async () => {
    userObj = await createTestUser({ user: "cartuser" });
    productObj = await createTestProduct({
      name: "Test Runner Shoe",
      cost: 1000000,
      size: { "40": 5, "41": 10 },
    });
  });

  it("should add an item to the user's cart", async () => {
    const res = await request(app)
      .post(`/cart?user=${userObj.account.user}`)
      .send({
        id: productObj._id.toString(),
        size: "40",
        quantity: 2,
      });

    expect(res.status).toBe(200);
    expect(res.body.cart).toHaveLength(1);
    expect(res.body.cart[0].id).toBe(productObj._id.toString());
    expect(res.body.cart[0].quantity).toBe(2);

    const account = await Account.findOne({ user: userObj.account.user });
    expect(account.cart).toHaveLength(1);
  });

  it("should reject adding quantity exceeding product stock", async () => {
    const res = await request(app)
      .post(`/cart?user=${userObj.account.user}`)
      .send({
        id: productObj._id.toString(),
        size: "40",
        quantity: 10, // Available is only 5
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/exceeds available stock/i);
  });

  it("should fetch current cart items", async () => {
    // Add item first
    await request(app)
      .post(`/cart?user=${userObj.account.user}`)
      .send({
        id: productObj._id.toString(),
        size: "40",
        quantity: 1,
      });

    const res = await request(app).get(`/cart?user=${userObj.account.user}`);
    expect(res.status).toBe(200);
    expect(res.body.cart).toHaveLength(1);
    expect(res.body.cart[0].size).toBe("40");
  });

  it("should update quantity in cart and return response", async () => {
    // Add 1 item
    await request(app)
      .post(`/cart?user=${userObj.account.user}`)
      .send({
        id: productObj._id.toString(),
        size: "40",
        quantity: 1,
      });

    // Update to 3
    const updateRes = await request(app)
      .put(`/cart?user=${userObj.account.user}`)
      .send({
        id: productObj._id.toString(),
        size: "40",
        quantity: 3,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.cart[0].quantity).toBe(3);
  });

  it("should remove item when quantity is updated to 0", async () => {
    await request(app)
      .post(`/cart?user=${userObj.account.user}`)
      .send({
        id: productObj._id.toString(),
        size: "40",
        quantity: 2,
      });

    const updateRes = await request(app)
      .put(`/cart?user=${userObj.account.user}`)
      .send({
        id: productObj._id.toString(),
        size: "40",
        quantity: 0,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.cart).toHaveLength(0);
  });

  it("should delete an item from cart", async () => {
    await request(app)
      .post(`/cart?user=${userObj.account.user}`)
      .send({
        id: productObj._id.toString(),
        size: "40",
        quantity: 1,
      });

    const delRes = await request(app).delete(
      `/cart?user=${userObj.account.user}&deleteId=${productObj._id}&size=40`
    );

    expect(delRes.status).toBe(200);
    expect(delRes.body.cart).toHaveLength(0);
  });
});

