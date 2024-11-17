import { AxiosResponse } from "axios";
import BaseService, { BaseResponse } from "./BaseService";
import { axiosInstance } from ".";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface VerifyResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
}

export default class LoginService extends BaseService {
  basePath: string;
  constructor() {
    super();
    this.basePath = "/auth";
  }

  async login(
    params: LoginRequest
  ): Promise<AxiosResponse<BaseResponse<LoginResponse>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.post(this.basePath + "/login", params);
  }

  async register(
    params: any
  ): Promise<AxiosResponse<BaseResponse<LoginResponse>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.post(this.basePath + "/register", params);
  }

  async logout(): Promise<AxiosResponse<BaseResponse<void>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.post(this.basePath + "/logout");
  }

  async verifyToken(): Promise<AxiosResponse<BaseResponse<VerifyResponse>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.get(this.basePath + "/verify");
  }
}
