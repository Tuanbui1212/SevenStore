function requireAdminOrStaff(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      code: "NO_TOKEN",
      message: "You are not logged in.",
    });
  }
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      code: "FORBIDDEN",
      message: "You do not have permission to access the admin panel.",
    });
  }
  next();
}

module.exports = requireAdminOrStaff;
