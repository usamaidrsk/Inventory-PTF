import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/signin",
        name: "signin",
        component: () =>  import("@/views/auth/SignIn.vue"),
    },
    {
        path: "/",
        name: "dashboard",
        component: () =>  import("@/views/dashboard/Index.vue"),
        children: [
            {
                path: "/",
                redirect: { name: 'home_dashboard' }
            },
            {
                path: "/app/dashboard",
                name: "home_dashboard",
                component: () =>  import("@/views/dashboard/home.vue"),
            },
            {
                path: "/app/invoices",
                name: "invoices",
                component: () =>  import("@/views/dashboard/sales/invoices/Index.vue")
            },
            {
                path: "/app/products",
                name: "products",
                component: () =>  import("@/views/dashboard/products/Index.vue")
            },
            {
                path: "/app/settings",
                name: "settings",
                component: () =>  import("@/views/dashboard/settings/Index.vue"),
                children: [
                    {
                        path: "/app/settings/tax",
                        name: "tax",
                        component: () =>  import("@/views/dashboard/settings/tax/Index.vue"),
                    },
                ]
            },
        ]
    },
    {
        path: "/:catchAll(.*)",
        component: () => import("@/views/NotFoundPage.vue"),
        name: 'Not found Page'
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    next(async (vm) => {
        if (!vm.$store.state?.auth?.isAuthenticated) {
            await vm.$router.push({
                path: '/signin',
                query: {
                    from: vm.$router.options?.history?.location || '/',
                }
            })
        } else {
            next()
        }
    })
})

export default router;
