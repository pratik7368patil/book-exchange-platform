import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  condition: string;
  status: string;
  owner: mongoose.Types.ObjectId;
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      minlength: [2, 'Book title must be at least 2 characters long'],
      maxlength: [100, 'Book title cannot exceed 100 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      minlength: [2, 'Author name must be at least 2 characters long'],
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: {
        values: ['fiction', 'non-fiction', 'mystery', 'sci-fi', 'romance', 'thriller', 'horror', 'biography', 'history', 'other'],
        message: '{VALUE} is not a valid genre',
      },
    },
    condition: {
      type: String,
      required: [true, 'Book condition is required'],
      enum: {
        values: ['new', 'like-new', 'good', 'fair', 'poor'],
        message: '{VALUE} is not a valid condition',
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['available', 'borrowed', 'reserved'],
        message: '{VALUE} is not a valid status',
      },
      default: 'available',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Book owner is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
bookSchema.index({ title: 'text', author: 'text', genre: 1 });
bookSchema.index({ owner: 1 });
bookSchema.index({ status: 1 });

export const Book = mongoose.model<IBook>('Book', bookSchema);