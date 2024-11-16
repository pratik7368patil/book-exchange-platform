import axios, { AxiosInstance } from "axios";
import config from "../config";
import LoginService from "./LoginService";

export let LoginServiceInstance: LoginService | null = null;
export function initServices() {
  // Add services here
  LoginServiceInstance = new LoginService();
}

export let axiosInstance: AxiosInstance | null = null;
export function initAxios() {
  axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || config.url,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default {
  LoginService: () => LoginServiceInstance,
};
