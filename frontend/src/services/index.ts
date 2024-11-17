import axios, { AxiosInstance } from "axios";
import config from "../config";
import { getToken } from "../helper";
import LoginService from "./LoginService";
import BooksService from "./BooksService";
import UsersService from "./UsersService";
import BookmarkService from "./BookmarkService";
import RequestsService from "./RequestsService";
import OrdersService from "./OrdersService";

export let LoginServiceInstance: LoginService | null = null;
export let BooksServiceInstance: BooksService | null = null;
export let UsersServiceInstance: UsersService | null = null;
export let BookmarkServiceInstance: BookmarkService | null = null;
export let RequestsServiceInstance: RequestsService | null = null;
export let OrdersServiceInstance: OrdersService | null = null;

export function initServices() {
  // Add services here
  LoginServiceInstance = new LoginService();
  BooksServiceInstance = new BooksService();
  UsersServiceInstance = new UsersService();
  BookmarkServiceInstance = new BookmarkService();
  RequestsServiceInstance = new RequestsService();
  OrdersServiceInstance = new OrdersService();
}

export let axiosInstance: AxiosInstance | null = null;
export function initAxios() {
  axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || config.url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor for authentication
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default {
  LoginService: () => LoginServiceInstance,
  BooksService: () => BooksServiceInstance,
  UsersService: () => UsersServiceInstance,
  BookmarkService: () => BookmarkServiceInstance,
  RequestsService: () => RequestsServiceInstance,
  OrdersService: () => OrdersServiceInstance,
};
