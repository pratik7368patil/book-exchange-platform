import express, { Request, Response } from "express";
import { Book } from "../models/Book";
import mongoose from "mongoose";
import multer from "multer";
import { uploadToS3 } from "../helpers/cloud";

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

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

// Get all books (paginated)
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Book.countDocuments(),
    ]);

    res.json({
      data: books,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

// Get books by user ID
router.get(
  "/user/:userId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.params;
      const books = await Book.find({ owner: userId }).sort({ createdAt: -1 });
      res.json(books);
    } catch (error) {
      console.error("Error fetching user books:", error);
      res.status(500).json({ message: "Error fetching user books", error });
    }
  }
);

// Get book by ID
router.get("/:bookId", async (req: Request, res: Response): Promise<any> => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId).populate("owner", "name email");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching book details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

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

// Upload book image
router.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Get user ID from auth middleware
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Generate a unique filename
      const timestamp = Date.now();
      const extension = req.file.originalname.split(".").pop();
      const filename = `books/${userId}/${timestamp}.${extension}`;

      const imageUrl = await uploadToS3({
        file: req.file.buffer,
        fileName: filename,
        mimeType: req.file.mimetype,
        userId,
      });
      res.json({ url: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  }
);

export default router;
