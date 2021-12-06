import { createWebHistory, createRouter } from "vue-router";
import SignIn from "@/views/auth/SignIn.vue";

const routes = [
    {
        path: "/",
        name: "SignIn",
        component: () =>  import("@/views/auth/SignIn.vue"),
    },
    {
        path: "/signup",
        name: "SignUp",
        component: SignIn,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
