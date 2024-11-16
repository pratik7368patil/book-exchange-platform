import { AxiosResponse } from "axios";
import { axiosInstance } from ".";

export interface BaseResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export default class BaseService {
  protected basePath: string;

  constructor() {
    this.basePath = "/";
  }

  protected async find<T>(): Promise<AxiosResponse<BaseResponse<T>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.get(this.basePath);
  }

  protected async update<T>(params: Partial<T>): Promise<AxiosResponse<BaseResponse<T>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.put(this.basePath, params);
  }

  protected async create<T>(params: Partial<T>): Promise<AxiosResponse<BaseResponse<T>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.post(this.basePath, params);
  }

  protected async delete(id: string): Promise<AxiosResponse<BaseResponse<void>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.delete(`${this.basePath}/${id}`);
  }
}