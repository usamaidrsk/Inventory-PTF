import { createApp } from 'vue'
import App from './App.vue'
import VueAxios from "vue-axios"
import router from './router'
import naive from './plugins/naive'
import axios from './plugins/axios'
import store from "./store";
import 'vfonts/Lato.css' // General Font
import 'vfonts/FiraCode.css'
import 'vfonts/Roboto.css'
import './css/tailwind.css'
import vSelect from 'vue-select'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(naive)
app.use(VueAxios, axios)
app.component("v-select", vSelect)

app.mount('#app')
