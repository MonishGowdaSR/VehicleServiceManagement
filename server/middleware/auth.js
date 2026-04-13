import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔴 Check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔴 Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    // 🔴 Validate decoded ID
    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // ✅ Attach user
    req.user = {
      id: decoded.id,          // MUST be Mongo ObjectId
      role: decoded.role || "USER",
    };

    console.log("✅ USER FROM TOKEN:", req.user);

    next();

  } catch (error) {
    console.error("❌ AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Token invalid" });
  }
};

export default protect;