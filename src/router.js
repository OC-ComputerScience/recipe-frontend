import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/DashBoard.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("./views/DashBoard.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/couriers",
      name: "couriers",
      component: () => import("./views/CourierList.vue"),
    },
    {
      path: "/couriers/:type",
      name: "filterCouriers",
      component: () => import("./views/CourierList.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("./views/UserList.vue"),
    },
    {
      path: "/customers",
      name: "customers",
      component: () => import("./views/CustomerList.vue"),
    },
    {
      path: "/add-user",
      name: "addUser",
      component: () => import("./views/AddUser.vue"),
    },
    {
      path: "/update-user/:id",
      name: "updateUser",
      component: () => import("./views/UpdateUser.vue"),
    },
    {
      path: "/add-customer",
      name: "addCustomer",
      component: () => import("./views/AddCustomer.vue"),
    },
    {
      path: "/update-customer/:id",
      name: "updateCustomer",
      component: () => import("./views/UpdateCustomer.vue"),
    },
    {
      path: "/add-courier",
      name: "addCourier",
      component: () => import("./views/AddCourier.vue"),
    },
    {
      path: "/update-courier/:id",
      name: "updateCourier",
      component: () => import("./views/UpdateCourier.vue"),
    },
  ],
});

export default router;
