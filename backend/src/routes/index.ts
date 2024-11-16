import express from "express";
const router = express.Router();
import { sayHello } from "../helpers";
import userRouter from "./users";
import authRouter, { authenticateToken } from "./auth";
import bookRouter from "./books";

router.get("/", sayHello);

// Protected book routes (all book routes require authentication)
router.use("/books", authenticateToken, bookRouter);

// User routes
router.use("/users", authenticateToken, userRouter);

// Auth routes
router.use("/auth", authRouter);

export default router;