const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      code: "NO_TOKEN",
      message: "You are not logged in. Please log in to continue.",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          code: "TOKEN_EXPIRED",
          message: "Your session has expired. Please log in again.",
        });
      }
      return res.status(401).json({
        code: "TOKEN_INVALID",
        message: "Invalid token. Please log in again.",
      });
    }
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
