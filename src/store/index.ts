import { createStore } from 'vuex'
import  AuthModule from  "./auth";

const store = createStore({
    strict: false,
    modules: {
        auth: AuthModule,
    },
    plugins: []
})

export default store;
