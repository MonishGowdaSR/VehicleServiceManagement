const adminOnly = (req, res, next) => {
  // check if user exists and role is admin
  if (req.user && req.user.role === "admin") {
    next(); // allow access
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

export default adminOnly;