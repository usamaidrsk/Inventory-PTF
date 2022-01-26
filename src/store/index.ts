import { createStore } from 'vuex'
import  AuthModule from  "./auth";
import  spinnerModule from  "./spinner";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    strict: false,
    modules: {
        auth: AuthModule,
        spinner: spinnerModule,
    },
    plugins: [createPersistedState()]

})

export default store;
export * as auth from './auth'
export * as spinner from './spinner'