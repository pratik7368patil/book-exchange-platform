import { createWebHistory, createRouter } from "vue-router";
import SecureRoute from "@/components/auth/SecureRoute.vue";

const routes = [
  {
    path: "/",
    component: SecureRoute,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Home.vue"),
        children: [
          {
            path: "",
            name: "books",
            component: () => import("@/components/BooksList.vue"),
          },
          {
            path: "book/:bookId",
            name: "book-details",
            component: () => import("@/components/BookDetails.vue"),
          },
          {
            path: "bookmarks",
            name: "bookmarks",
            component: () => import("@/components/Bookmarks.vue"),
          },
          {
            path: "/profile",
            name: "profile",
            component: () => import("@/components/Profile.vue"),
          },
          {
            path: "/register-book",
            name: "register-book",
            component: () => import("@/components/RegisterBook.vue"),
          },
          {
            path: "/my-books",
            name: "my-books",
            component: () => import("@/components/MyBooks.vue"),
          },
          {
            path: "/requests",
            name: "requests",
            component: () => import("@/components/Requests.vue"),
          },
          {
            path: "/orders",
            name: "orders",
            component: () => import("@/components/OrdersHistory.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterUser.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
