import express from "express";
const router = express.Router();
import { sayHello } from "../helpers";
import userRouter from "./users";
import authRouter, { authenticateToken } from "./auth";
import bookRouter from "./books";
import bookmarkRouter from "./bookmark";
import requestRouter from "./requests";
import ordersRouter from "./orders";

router.get("/", sayHello);

// Protected book routes (all book routes require authentication)
router.use("/books", authenticateToken, bookRouter);

// User routes
router.use("/users", authenticateToken, userRouter);

// Bookmark routes (protected)
router.use("/bookmarks", authenticateToken, bookmarkRouter);

// Request routes (protected)
router.use("/requests", authenticateToken, requestRouter);

// Orders routes (protected)
router.use("/orders", authenticateToken, ordersRouter);

// Auth routes
router.use("/auth", authRouter);

export default router;
