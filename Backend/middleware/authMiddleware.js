import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Check if authorization header with Bearer token is present
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Get token from "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
      
      req.user = await User.findById(decoded._id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next(); // Continue to the next middleware or route
    } catch (err) {
      console.error("Auth error:", err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};
