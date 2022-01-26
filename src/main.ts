import { createApp } from 'vue'
import App from './App.vue'
import VueAxios from "vue-axios";
import router from './router'
import naive from './plugins/naive'
import axios from './plugins/axios'
// import { AxiosKey } from './plugins/symbols'
import store from "./store";
import 'vfonts/Lato.css' // General Font
import 'vfonts/FiraCode.css'
import 'vfonts/Roboto.css'
import './css/tailwind.css'
import {mapGetters} from "vuex";

const app = createApp(App)
app.use(store)
app.use(router)
app.use(naive)
app.use(VueAxios, axios)
// app.provide(AxiosKey, axios)
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
