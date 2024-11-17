import { AxiosResponse } from "axios";
import BaseService, { BaseResponse } from "./BaseService";
import { axiosInstance } from ".";
import type { Book } from "./BooksService";
import type { User } from "./UsersService";

export interface ExchangeRequest {
  id: string;
  sender: User;
  senderBook: Book;
  receiver: User;
  receiverBook: Book;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExchangeRequest {
  senderBookId: string;
  receiverBookId: string;
  senderId: string;
  receiverId: string;
}

export default class RequestsService extends BaseService {
  basePath: string;
  constructor() {
    super();
    this.basePath = "/requests";
  }

  // Create a new exchange request
  async createRequest(
    data: CreateExchangeRequest
  ): Promise<AxiosResponse<BaseResponse<ExchangeRequest>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.post(this.basePath, data);
  }

  // Accept exchange request
  async acceptRequest(
    requestId: string,
    userId: string
  ): Promise<AxiosResponse<BaseResponse<ExchangeRequest>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.put(`${this.basePath}/${requestId}/accept`, {
      userId,
    });
  }

  // Reject exchange request
  async rejectRequest(
    requestId: string,
    userId: string
  ): Promise<AxiosResponse<BaseResponse<ExchangeRequest>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.put(`${this.basePath}/${requestId}/reject`, {
      userId,
    });
  }

  // Cancel exchange request
  async cancelRequest(
    requestId: string,
    userId: string
  ): Promise<AxiosResponse<BaseResponse<ExchangeRequest>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.put(`${this.basePath}/${requestId}/cancel`, {
      userId,
    });
  }

  // Get all requests for a user (both sent and received)
  async getUserRequests(
    userId: string
  ): Promise<AxiosResponse<BaseResponse<ExchangeRequest[]>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.get(`${this.basePath}/user/${userId}`);
  }
}
