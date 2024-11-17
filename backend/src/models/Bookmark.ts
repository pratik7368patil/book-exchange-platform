import mongoose, { Schema, Document } from "mongoose";

export interface IBookmark extends Document {
  user: Schema.Types.ObjectId;
  book: Schema.Types.ObjectId;
  createdAt: Date;
  notes?: string;
}

const BookmarkSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to prevent duplicate bookmarks
BookmarkSchema.index({ user: 1, book: 1 }, { unique: true });

BookmarkSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

BookmarkSchema.virtual("id").get(function () {
  return this._id;
});

export default mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
