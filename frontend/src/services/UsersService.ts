import { AxiosResponse } from "axios";
import BaseService, { BaseResponse } from "./BaseService";
import { axiosInstance } from ".";

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  avatar?: string;
}

export default class UsersService extends BaseService {
  constructor() {
    super();
    this.basePath = "/users";
  }

  /**
   * Get user by ID
   * @param id User ID
   */
  async getUser(id: string): Promise<AxiosResponse<BaseResponse<User>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.get(`${this.basePath}/${id}`);
  }

  /**
   * Create a new user
   * @param userData User data
   */
  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<AxiosResponse<BaseResponse<User>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.post(this.basePath, userData);
  }

  /**
   * Update user profile
   * @param id User ID
   * @param userData Updated user data
   */
  async updateProfile(
    id: string,
    userData: UpdateProfileData
  ): Promise<AxiosResponse<BaseResponse<User>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.put(`${this.basePath}/${id}`, userData);
  }

  /**
   * Delete user account
   * @param id User ID
   */
  async deleteUser(id: string): Promise<AxiosResponse<BaseResponse<void>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    return axiosInstance.delete(`${this.basePath}/${id}`);
  }

  /**
   * Upload user avatar
   * @param id User ID
   * @param file Avatar file
   */
  async uploadAvatar(
    id: string,
    file: File
  ): Promise<AxiosResponse<BaseResponse<User>>> {
    if (!axiosInstance) throw new Error("Axios instance not initialized");
    const formData = new FormData();
    formData.append("avatar", file);

    return axiosInstance.post(`${this.basePath}/${id}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
