import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

interface UploadParams {
  file: Buffer | Readable;
  fileName: string;
  mimeType: string;
  userId: string;
}

interface UpdateParams extends Omit<UploadParams, "userId"> {
  oldKey: string;
  userId: string;
}

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = "book-exchange-platform";
const FOLDER_PREFIX = "books";

/**
 * Generate a unique key for S3 storage
 */
const generateKey = (userId: string, fileName: string): string => {
  return `${FOLDER_PREFIX}/${userId}/${Date.now()}-${fileName}`;
};

/**
 * Extract key from S3 URL
 */
const extractKeyFromUrl = (url: string): string => {
  const urlObj = new URL(url);
  return urlObj.pathname.slice(1); // Remove leading slash
};

/**
 * Upload a file to S3
 */
export const uploadToS3 = async ({
  file,
  fileName,
  mimeType,
  userId,
}: UploadParams): Promise<string> => {
  try {
    const key = generateKey(userId, fileName);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
    });

    await s3Client.send(command);
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};

/**
 * Update an existing file in S3
 */
export const updateInS3 = async ({
  file,
  fileName,
  mimeType,
  oldKey,
  userId,
}: UpdateParams): Promise<string> => {
  try {
    // Delete the old file first
    await deleteFromS3(oldKey);

    // Upload the new file
    return await uploadToS3({ file, fileName, mimeType, userId });
  } catch (error) {
    console.error("Error updating file in S3:", error);
    throw new Error("Failed to update file in S3");
  }
};

/**
 * Delete a file from S3
 */
export const deleteFromS3 = async (key: string): Promise<void> => {
  try {
    // If a full URL is provided, extract the key
    const fileKey = key.startsWith("http") ? extractKeyFromUrl(key) : key;

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
};

/**
 * Get a signed URL for temporary access to a private S3 object
 */
export const getPresignedUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string> => {
  try {
    // If a full URL is provided, extract the key
    const fileKey = key.startsWith("http") ? extractKeyFromUrl(key) : key;

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate signed URL");
  }
};
