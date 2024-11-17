import express, { Request, Response } from "express";
import Bookmark from "../models/Bookmark";
import mongoose from "mongoose";

const router = express.Router();

// Get all bookmarks by userId
router.get(
  "/user/:userId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const bookmarks = await Bookmark.find({ user: userId })
        .populate("book")
        .sort({ createdAt: -1 });
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookmarks", error });
    }
  }
);

// Create or update bookmark
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, bookId, notes } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(bookId)
    ) {
      return res.status(400).json({ message: "Invalid user ID or book ID" });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { user: userId, book: bookId },
      {
        user: userId,
        book: bookId,
        notes,
        updatedAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    ).populate("book");

    res.json(bookmark);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating/updating bookmark", error });
  }
});

// Delete bookmark by userId and bookId
router.delete(
  "/user/:userId/book/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId, bookId } = req.params;
      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(bookId)
      ) {
        return res.status(400).json({ message: "Invalid user ID or book ID" });
      }

      const bookmark = await Bookmark.findOne({ user: userId, book: bookId });
      if (!bookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }

      await Bookmark.findOneAndDelete({ user: userId, book: bookId });
      res.json({ message: "Bookmark deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting bookmark", error });
    }
  }
);

export default router;
