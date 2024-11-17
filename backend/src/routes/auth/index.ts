import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
import { handleLogin, handleRegistration, handleTokenAuth } from "./handlers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).send({ message: "Authentication token required", error: true });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.user = decoded; // Add user info to request object
    next();
  } catch (error) {
    return res.status(403).send({ message: "Invalid or expired token", error: true });
  }
};

router.post("/login", handleLogin);
router.post("/register", handleRegistration);
router.get("/verify", authenticateToken, handleTokenAuth);

export default router;

// Type declaration for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}
