const request = require("supertest");
const app = require("../src/index");
const { setupDB, createTestUser } = require("./setup");
const Account = require("../src/app/models/Account");

setupDB();

describe("Authentication & Account API", () => {
  describe("POST /register", () => {
    it("should successfully register a new customer account", async () => {
      const res = await request(app)
        .post("/register")
        .send({
          formData: {
            name: "John Doe",
            user: "johndoe",
            password: "password123",
          },
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body.user).toHaveProperty("user", "johndoe");

      const inDb = await Account.findOne({ user: "johndoe" });
      expect(inDb).not.toBeNull();
      expect(inDb.role).toBe("customer");
    });

    it("should reject registration with missing required fields", async () => {
      const res = await request(app)
        .post("/register")
        .send({
          formData: {
            user: "missingfields",
          },
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/required/i);
    });

    it("should reject registration with duplicate username", async () => {
      await createTestUser({ user: "existinguser" });

      const res = await request(app)
        .post("/register")
        .send({
          formData: {
            name: "Duplicate User",
            user: "existinguser",
            password: "password123",
          },
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already taken/i);
    });
  });

  describe("POST /login", () => {
    it("should login successfully with correct credentials", async () => {
      await createTestUser({ user: "alice", password: "mypassword", role: "customer" });

      const res = await request(app)
        .post("/login")
        .send({
          username: "alice",
          password: "mypassword",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body.user).toBe("alice");
      expect(res.body.redirectUrl).toBe("/");
    });

    it("should redirect admin/staff to /dashboard on login", async () => {
      await createTestUser({ user: "admin1", password: "adminpassword", role: "admin" });

      const res = await request(app)
        .post("/login")
        .send({
          username: "admin1",
          password: "adminpassword",
        });

      expect(res.status).toBe(200);
      expect(res.body.redirectUrl).toBe("/dashboard");
    });

    it("should reject login with incorrect password", async () => {
      await createTestUser({ user: "bob", password: "correctpassword" });

      const res = await request(app)
        .post("/login")
        .send({
          username: "bob",
          password: "wrongpassword",
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/incorrect/i);
    });

    it("should reject login with non-existent username", async () => {
      const res = await request(app)
        .post("/login")
        .send({
          username: "ghostuser",
          password: "anypassword",
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Account details & Password update", () => {
    it("should get account information by id when authenticated", async () => {
      const { account, token } = await createTestUser({ user: "profileuser", name: "Profile Name" });

      const res = await request(app)
        .get(`/account/${account._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Profile Name");
      expect(res.body.user).toBe("profileuser");
      expect(res.body.password).toBeUndefined(); // password should never be exposed
    });

    it("should update password when providing correct old password", async () => {
      const { account, token } = await createTestUser({ password: "oldPassword123" });

      const res = await request(app)
        .put(`/account/${account._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: "oldPassword123",
          newPassword: "newPassword456",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/success/i);

      // Verify new password works
      const loginRes = await request(app)
        .post("/login")
        .send({
          username: account.user,
          password: "newPassword456",
        });
      expect(loginRes.status).toBe(200);
    });

    it("should reject password update if old password is wrong", async () => {
      const { account, token } = await createTestUser({ password: "originalPassword" });

      const res = await request(app)
        .put(`/account/${account._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: "wrongOldPassword",
          newPassword: "newPassword456",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/incorrect/i);
    });
  });
});

