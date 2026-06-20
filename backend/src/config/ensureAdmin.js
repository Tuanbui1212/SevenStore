const bcrypt = require("bcryptjs");
const Account = require("../app/models/Account");

async function ensureAdmin() {
  const existing = await Account.findOne({ user: "admin" });

  if (!existing) {
    const hashed = await bcrypt.hash("admin", 10);
    await Account.create({
      name: "Administrator",
      user: "admin",
      password: hashed,
      role: "admin",
      cart: [],
    });
    console.log("✅ Default admin account created (admin / admin)");
    return;
  }

  // Verify the stored password is actually "admin"
  const isHashed = existing.password.startsWith("$2");
  const passwordIsCorrect =
    isHashed && (await bcrypt.compare("admin", existing.password));

  if (!passwordIsCorrect) {
    const hashed = await bcrypt.hash("admin", 10);
    await Account.updateOne(
      { user: "admin" },
      { password: hashed, role: "admin" }
    );
    console.log("✅ Admin password reset to (admin / admin)");
  }
}

module.exports = ensureAdmin;
