import { AxiosResponse } from "axios";
import BaseService, { BaseResponse } from "./BaseService";
import { axiosInstance } from ".";

export interface Book {
  id?: string;
  title: string;
  author: string;
  genre: string;
  condition: string;
  status: string;
  owner: string;
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SearchBooksParams {
  title?: string;
  author?: string;
  genre?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface BooksResponse {
  data: Book[];
  pagination: PaginationResponse;
}

export default class BooksService extends BaseService {
  basePath: string;
  constructor() {
    super();
    this.basePath = "/books";
  }

  // Get all books with pagination
  async getAllBooks(params: PaginationParams): Promise<AxiosResponse<BooksResponse>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    const queryParams = new URLSearchParams();
    queryParams.append("page", params.page.toString());
    queryParams.append("limit", params.limit.toString());
    return axiosInstance.get(`${this.basePath}?${queryParams.toString()}`);
  }

  // Search books
  async searchBooks(
    params: SearchBooksParams
  ): Promise<AxiosResponse<BaseResponse<Book[]>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    const queryParams = new URLSearchParams();
    if (params.title) queryParams.append("title", params.title);
    if (params.author) queryParams.append("author", params.author);
    if (params.genre) queryParams.append("genre", params.genre);
    return axiosInstance.get(
      `${this.basePath}/search?${queryParams.toString()}`
    );
  }

  // Get user's books
  async getUserBooks(
    userId: string
  ): Promise<AxiosResponse<BaseResponse<Book[]>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.get(`${this.basePath}/user/${userId}`);
  }

  // Register new book
  async registerBook(
    book: Omit<Book, "id" | "createdAt" | "updatedAt">
  ): Promise<AxiosResponse<BaseResponse<Book>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.post(`${this.basePath}/register`, book);
  }

  // Update book
  async updateBook(
    id: string,
    book: Partial<Book>
  ): Promise<AxiosResponse<BaseResponse<Book>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.put(`${this.basePath}/${id}`, book);
  }

  // Delete book
  async deleteBook(bookId: string): Promise<AxiosResponse<BaseResponse<void>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.delete(`${this.basePath}/${bookId}`);
  }

  // Upload book image
  async uploadBookImage(file: File): Promise<{ url: string }> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    const formData = new FormData();
    formData.append("image", file);

    return axiosInstance.post(`${this.basePath}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Get book by ID
  async getBookById(bookId: string): Promise<AxiosResponse<BaseResponse<Book>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.get(`${this.basePath}/${bookId}`);
  }
}
