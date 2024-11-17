import express, { Request, Response } from "express";
import { Book } from "../models/Book";
import { Request as ExchangeRequest } from "../models/Request";
import { Order } from "../models/Order";
import mongoose from "mongoose";

const router = express.Router();

// Send exchange request
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { senderBookId, receiverBookId, senderId } = req.body;

    // Validate books exist
    const [senderBook, receiverBook] = await Promise.all([
      Book.findById(senderBookId),
      Book.findById(receiverBookId),
    ]);

    if (!senderBook || !receiverBook) {
      return res.status(404).json({ message: "One or both books not found" });
    }

    // Validate sender owns the book
    if (senderBook.owner.toString() !== senderId) {
      return res.status(403).json({ message: "You do not own this book" });
    }

    // Check if books are available
    if (!senderBook.isAvailable || !receiverBook.isAvailable) {
      return res.status(400).json({
        message: "One or both books are not available for exchange",
      });
    }

    // Check for existing request
    const existingRequest = await ExchangeRequest.findOne({
      senderBook: senderBookId,
      receiverBook: receiverBookId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Exchange request already exists" });
    }

    // Create exchange request
    const request = new ExchangeRequest({
      sender: senderId,
      senderBook: senderBookId,
      receiver: receiverBook.owner,
      receiverBook: receiverBookId,
    });

    await request.save();

    // Populate the request with book and user details
    const populatedRequest = await request.populate([
      { path: "sender", select: "_id name email" },
      { path: "receiver", select: "_id name email" },
      { path: "senderBook", select: "_id title author" },
      { path: "receiverBook", select: "_id title author" },
    ]);

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error("Error creating exchange request:", error);
    res.status(500).json({ message: "Error creating exchange request", error });
  }
});

// Accept exchange request
router.put("/:id/accept", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const request = await ExchangeRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Verify the user is the receiver
    if (request.receiver.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request" });
    }

    // Verify request is pending
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Request is already ${request.status}` });
    }

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update request status
      request.status = "accepted";
      await request.save({ session });

      // Create order for the accepted request
      const order = new Order({
        request: request._id,
        status: "pending",
      });
      await order.save({ session });

      // Update both books' status
      await Promise.all([
        Book.findByIdAndUpdate(
          request.senderBook,
          { isAvailable: false, status: "exchanged" },
          { session }
        ),
        Book.findByIdAndUpdate(
          request.receiverBook,
          { isAvailable: false, status: "exchanged" },
          { session }
        ),
      ]);

      await session.commitTransaction();
      res.json(request);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error accepting exchange request:", error);
    res
      .status(500)
      .json({ message: "Error accepting exchange request", error });
  }
});

// Reject exchange request
router.put("/:id/reject", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const request = await ExchangeRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Verify the user is the receiver
    if (request.receiver.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this request" });
    }

    // Verify request is pending
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Request is already ${request.status}` });
    }

    request.status = "rejected";
    await request.save();

    res.json(request);
  } catch (error) {
    console.error("Error rejecting exchange request:", error);
    res
      .status(500)
      .json({ message: "Error rejecting exchange request", error });
  }
});

// Cancel exchange request
router.put("/:id/cancel", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Validate request exists
    const request = await ExchangeRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Exchange request not found" });
    }

    // Validate user is the sender of the request
    if (request.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the sender can cancel this request" });
    }

    // Check if request is already completed or cancelled
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Can only cancel pending requests" });
    }

    // Update request status to cancelled
    request.status = "cancelled";
    await request.save();

    return res.json(request);
  } catch (error) {
    console.error("Error cancelling exchange request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all requests for a user (both sent and received)
router.get(
  "/user/:userId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.params;

      const requests = await ExchangeRequest.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate([
          { path: "sender", select: "_id name email" },
          { path: "receiver", select: "_id name email" },
          { path: "senderBook", select: "_id title author imageUrl" },
          { path: "receiverBook", select: "_id title author imageUrl" },
        ])
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (error) {
      console.error("Error fetching user requests:", error);
      res.status(500).json({ message: "Error fetching user requests", error });
    }
  }
);

export default router;
