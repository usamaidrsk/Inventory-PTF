import { createApp } from 'vue'
import App from './App.vue'
import VueAxios from "vue-axios";
import router from './router'
import naive from './plugins/naive'
import axios from './plugins/axios'
import store from "./store";
import 'vfonts/Lato.css' // General Font
import 'vfonts/FiraCode.css'
import 'vfonts/Roboto.css'
import './css/tailwind.css'
import {mapGetters} from "vuex";

const app = createApp(App)
app.mixin({
    async beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            if (!vm.$store.state?.auth?.isAuthenticated) {
                next({
                    name: 'SignIn',
                    query: {
                        from: to.fullPath,
                    }
                })
            } else {
                next()
            }
        })

    },
    computed: {
        ...mapGetters({
            isAuthenticated: "auth/GET_IS_AUTHENTICATED",
        })
    },
    watch: {
        isAuthenticated(val) {
            if (!val) {
                this.$router.push({
                    path: '/signin',
                    query: {
                        from: this.$router?.history?.current?.fullPath || '/dashboard',
                    }
                }).then()
            }
        }
    }
})
app.use(store)
app.use(router)
app.use(naive)
app.use(VueAxios, axios)
app.mixin({
    //TODO beforeRouteEnter mixin setup
    computed: {
        ...mapGetters({
            isAuthenticated: "auth/GET_IS_AUTHENTICATED",
        })
    },
    watch: {
        async isAuthenticated(val) {
            if (!val) {
                await this.$router.push({
                    path: '/',
                    query: {
                        from: this.$router.options?.history?.location || '/',
                    }
                })
            }
        }
    }
})

app.mount('#app')
