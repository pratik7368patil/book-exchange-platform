import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  id: string;
  request: Request;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingMethod: "standard" | "express" | "pickup" | "online";
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "pickup", "online"],
      default: "online",
      required: true,
    },
    trackingNumber: {
      type: String,
      required: false,
    },
    estimatedDeliveryDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for id
OrderSchema.virtual("id").get(function (this: { _id: string }) {
  return this._id;
});

// Ensure virtuals are included when converting document to JSON
OrderSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
