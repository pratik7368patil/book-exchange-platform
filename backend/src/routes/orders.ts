import express, { Request, Response } from "express";
import { Order } from "../models/Order";
import { Request as ExchangeRequest } from "../models/Request";

const router = express.Router();

// Create a new order
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { requestId, shippingMethod } = req.body;

    // Validate request exists and is accepted
    const request = await ExchangeRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Exchange request not found" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({
        message: "Can only create orders for accepted exchange requests",
      });
    }

    // Check if order already exists for this request
    const existingOrder = await Order.findOne({ request: requestId });
    if (existingOrder) {
      return res.status(400).json({
        message: "Order already exists for this exchange request",
      });
    }

    // Create new order
    const order = new Order({
      request: requestId,
      shippingMethod,
      status: "pending",
    });

    await order.save();

    // Populate request details
    await order.populate({
      path: "request",
      populate: [
        { path: "sender", select: "name email _id" },
        { path: "receiver", select: "name email _id" },
        { path: "senderBook", select: "title author _id" },
        { path: "receiverBook", select: "title author _id" },
      ],
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

// Update order status
router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, estimatedDeliveryDate } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order fields
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDeliveryDate)
      order.estimatedDeliveryDate = new Date(estimatedDeliveryDate);

    await order.save();

    // Populate request details
    await order.populate({
      path: "request",
      populate: [
        { path: "sender", select: "name email _id" },
        { path: "receiver", select: "name email _id" },
        { path: "senderBook", select: "title author _id" },
        { path: "receiverBook", select: "title author _id" },
      ],
    });

    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order" });
  }
});

// Get all orders for a user (both as sender and receiver)
router.get(
  "/user/:userId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.params;

      // Find orders where user is either sender or receiver
      const orders = await Order.find()
        .populate({
          path: "request",
          populate: [
            { path: "sender", select: "name email _id" },
            { path: "receiver", select: "name email _id" },
            { path: "senderBook", select: "title author _id" },
            { path: "receiverBook", select: "title author _id" },
          ],
        })
        .sort({ createdAt: -1 });

      // Filter orders where user is either sender or receiver
      const userOrders = orders.filter(
        (order: any) =>
          order.request.sender.id === userId ||
          order.request.receiver.id === userId
      );

      res.json(userOrders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  }
);

export default router;
