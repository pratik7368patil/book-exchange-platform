import { AxiosResponse } from "axios";
import BaseService, { BaseResponse } from "./BaseService";
import { axiosInstance } from ".";

export interface Order {
  id?: string;
  request: string;
  status: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateOrderParams {
  status?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
}

export default class OrdersService extends BaseService {
  basePath: string;
  constructor() {
    super();
    this.basePath = "/orders";
  }

  // Get user's orders
  async getUserOrders(
    userId: string
  ): Promise<AxiosResponse<BaseResponse<Order[]>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.get(`${this.basePath}/user/${userId}`);
  }
}
