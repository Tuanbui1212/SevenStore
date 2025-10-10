const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Thiếu token, chưa đăng nhập!" });
  }

  jwt.verify(token, "secret_key", (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    req.user = user; // lưu thông tin user vào req
    next(); // cho phép đi tiếp
  });
}

module.exports = authMiddleware;
