import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token;

  // check header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // extract token
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach user info
      req.user = decoded;

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;