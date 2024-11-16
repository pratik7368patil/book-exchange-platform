import express, { Request, Response } from "express";
import { Book } from "../models/Book";
import mongoose from "mongoose";

const router = express.Router();

// Search books by title, author, genre
router.get("/search", async (req: Request, res: Response) => {
  try {
    const { title, author, genre } = req.query;
    const query: any = {};

    if (title) query.title = { $regex: title as string, $options: "i" };
    if (author) query.author = { $regex: author as string, $options: "i" };
    if (genre) query.genre = { $regex: genre as string, $options: "i" };

    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error searching books", error });
  }
});

// Get all books
router.get("/", async (_req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

// Get all books by userId
router.get(
  "/user/:userId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const books = await Book.find({ owner: userId });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user books", error });
    }
  }
);

// Update book details
router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
});

// Delete book
router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await Book.findByIdAndDelete(id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
});

// Register a new book
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, author, genre, condition, description, imageUrl, owner } =
      req.body;

    // Validate required fields
    if (!title || !author || !genre || !condition || !owner) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Validate owner ID
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({
        message: "Invalid owner ID",
      });
    }

    const newBook = new Book({
      title,
      author,
      genre,
      condition,
      description,
      imageUrl,
      owner,
      status: "available",
      isAvailable: true,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Error registering book",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Error registering book",
        error: "An unknown error occurred",
      });
    }
  }
});

export default router;
