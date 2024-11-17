import { AxiosResponse } from "axios";
import BaseService, { BaseResponse } from "./BaseService";
import { axiosInstance } from ".";
import { Book } from "./BooksService";

export interface Bookmark {
  id?: string;
  user: string;
  book: Book;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBookmarkParams {
  userId: string;
  bookId: string;
  notes?: string;
}

export default class BookmarkService extends BaseService {
  basePath: string;
  constructor() {
    super();
    this.basePath = "/bookmarks";
  }

  // Get user's bookmarks
  async getUserBookmarks(userId: string): Promise<AxiosResponse<BaseResponse<Bookmark[]>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.get(`${this.basePath}/user/${userId}`);
  }

  // Create or update bookmark
  async createOrUpdateBookmark(params: CreateBookmarkParams): Promise<AxiosResponse<BaseResponse<Bookmark>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.post(this.basePath, params);
  }

  // Delete bookmark
  async deleteBookmark(userId: string, bookId: string): Promise<AxiosResponse<BaseResponse<void>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.delete(`${this.basePath}/user/${userId}/book/${bookId}`);
  }
}
