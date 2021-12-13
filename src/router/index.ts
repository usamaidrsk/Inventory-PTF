import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/",
        name: "SignIn",
        component: () =>  import("@/views/auth/SignIn.vue"),
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () =>  import("@/views/dashboard/Index.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
