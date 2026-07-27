import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401).json({ message: "Not authorized, user not found." });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, no token." });
    }
  } else {
    res.status(401).json({
      message: "Not authorized, no token.",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && res.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin role required." });
  }
};

export const ownerOnly = (req, res, next) => {
  if ((req.user && res.user.role === "owner") || es.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, owner role required." });
  }
};
