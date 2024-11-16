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
            path: "/register-book",
            name: "register-book",
            component: () => import("@/components/RegisterBook.vue"),
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
  history: createWebHistory(),
  routes,
});

export default router;
