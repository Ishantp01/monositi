// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../modules/users/user.model"); // adjust path if needed

// ✅ Middleware to protect routes (requires valid JWT)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token, exclude password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      console.error("Auth error:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// ✅ Middleware to allow only admins
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied: Admins only");
  }
};

const serviceProviderOnly = (req, res, next) => {
  if (req.user.role !== "serviceProvider") {
    return res.status(403).json({ message: "Access denied: Service Provider only" });
  }
  next();
};

const tenantOnly = (req, res, next) => {
  if (req.user.role !== "tenant") {
    return res.status(403).json({ message: "Access denied: Tenant only" });
  }
  next();
};

module.exports = { protect, adminOnly, serviceProviderOnly, tenantOnly,  };
