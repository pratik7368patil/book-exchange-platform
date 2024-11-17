import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  sender: mongoose.Types.ObjectId;
  senderBook: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  receiverBook: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderBook: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverBook: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster queries
RequestSchema.index({ sender: 1, status: 1 });
RequestSchema.index({ receiver: 1, status: 1 });
RequestSchema.index({ senderBook: 1 });
RequestSchema.index({ receiverBook: 1 });

RequestSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

RequestSchema.virtual("id").get(function () {
  return this._id;
});

export const Request = mongoose.model<IRequest>("Request", RequestSchema);
