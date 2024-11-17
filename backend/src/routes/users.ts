import express from "express";
import User from "../models/User";
import multer from "multer";
import { uploadToS3 } from "../helpers/cloud";
const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
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

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.error("Error while getting user", error);
    res.status(500).send({ message: error, error: true });
  }
});

router.post("/", async (req, res): Promise<any> => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Email and password are required", error: true });
    }

    const userWithSameEmail = await User.findOne({ email: req.body.email });
    if (userWithSameEmail) {
      return res
        .status(400)
        .send({ message: "Email already exists", error: true });
    }

    const user = await User.create(req.body);
    res.send(user);
  } catch (error) {
    console.error("Error while creating user", error);
    res.status(500).send({ message: error, error: true });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.updateOne({ id: req.params.id }, req.body);
    res.send(user);
  } catch (error) {
    console.error("Error while updating user", error);
    res.status(500).send({ message: error, error: true });
  }
});

router.delete("/:id", async (req, res): Promise<any> => {
  try {
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).send({ message: "User not found", error: true });
    }

    const user = await User.deleteOne({ id: req.params.id });
    res.send(user);
  } catch (error) {
    console.error("Error while deleting user", error);
    res.status(500).send({ message: error, error: true });
  }
});

// Upload avatar route
router.post(
  "/:id/avatar",
  upload.single("avatar"),
  async (req, res): Promise<any> => {
    try {
      // Check if user exists and matches authenticated user
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send({ message: "User not found", error: true });
      }

      if (user.id.toString() !== req.user?.userId) {
        return res.status(403).send({ message: "Unauthorized", error: true });
      }

      if (!req.file) {
        return res
          .status(400)
          .send({ message: "No file uploaded", error: true });
      }

      // Upload to S3
      const avatarUrl = await uploadToS3({
        file: req.file.buffer,
        fileName: `${req.file.originalname}`,
        mimeType: req.file.mimetype,
        userId: user.id.toString(),
      });

      // Update user's avatar URL
      user.avatar = avatarUrl;
      await user.save();

      res.send({ user, error: false });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).send({ message: "Error uploading avatar", error: true });
    }
  }
);

export default router;
