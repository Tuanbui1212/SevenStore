const request = require("supertest");
const app = require("../src/index");
const { setupDB, createTestUser, createTestProduct } = require("./setup");
const Order = require("../src/app/models/Order");
const Employee = require("../src/app/models/Employees");
const Customer = require("../src/app/models/Customer");

setupDB();

describe("Dashboard & Admin Operations (/dashboard)", () => {
  let admin, staff, customer;

  beforeEach(async () => {
    admin = await createTestUser({ user: "adminuser", role: "admin" });
    staff = await createTestUser({ user: "staffuser", role: "staff" });
    customer = await createTestUser({ user: "custuser", role: "customer" });
  });

  describe("RBAC & Access Control", () => {
    it("should reject unauthenticated requests with 401", async () => {
      const res = await request(app).get("/dashboard/orders/count-pending");
      expect(res.status).toBe(401);
    });

    it("should reject customer requests with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/dashboard/orders/count-pending")
        .set("Authorization", `Bearer ${customer.token}`);
      expect(res.status).toBe(403);
    });

    it("should allow staff to access dashboard endpoints", async () => {
      const res = await request(app)
        .get("/dashboard/orders/count-pending")
        .set("Authorization", `Bearer ${staff.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("count");
    });

    it("should allow admin to access dashboard endpoints", async () => {
      const res = await request(app)
        .get("/dashboard/orders/stats")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("totalRevenue");
      expect(res.body).toHaveProperty("totalOrders");
    });
  });

  describe("Employee Management (/dashboard/employee)", () => {
    it("should allow creating, updating, and viewing employees", async () => {
      // Create employee
      const createRes = await request(app)
        .post("/dashboard/employee/create")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({
          name: "Nguyen Van A",
          role: "Sales Associate",
          status: "Full-Time",
          date: new Date(),
        });
      expect(createRes.status).toBe(201);

      // List employees
      const listRes = await request(app)
        .get("/dashboard/employee")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(listRes.status).toBe(200);
      expect(listRes.body.employees).toHaveLength(1);

      const empId = listRes.body.employees[0]._id;

      // Edit / view single employee
      const getRes = await request(app)
        .get(`/dashboard/employee/${empId}`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.employee.name).toBe("Nguyen Van A");

      // Soft delete
      const delRes = await request(app)
        .delete(`/dashboard/employee/${empId}`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(delRes.status).toBe(200);

      // Restore
      const restoreRes = await request(app)
        .patch(`/dashboard/employee/trash/${empId}/restore`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(restoreRes.status).toBe(200);
    });
  });

  describe("Customer Management (/dashboard/customers)", () => {
    it("should list and update customer records", async () => {
      const newCust = await Customer.create({
        name: "Tran Thi B",
        phone: "0987654321",
        address: "456 Avenue, Danang",
      });

      const listRes = await request(app)
        .get("/dashboard/customers")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(listRes.status).toBe(200);
      expect(listRes.body.customers).toHaveLength(1);

      const updateRes = await request(app)
        .put(`/dashboard/customers/${newCust._id}`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ address: "789 New Blvd, Danang" });
      expect(updateRes.status).toBe(200);

      const updated = await Customer.findById(newCust._id);
      expect(updated.address).toBe("789 New Blvd, Danang");
    });
  });
});

