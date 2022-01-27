import axios, {AxiosRequestConfig} from 'axios';
import store from '@/store';

const apiUrl = process.env.VUE_APP_API_URL;
axios.defaults.baseURL = apiUrl;

axios.interceptors.request.use((request: AxiosRequestConfig): AxiosRequestConfig => {
        const token = localStorage.getItem('access_token');
        if (token)  request.headers = {...request.headers, authorization: `Bearer ${token}`};
        return request;
    }
);

// TODO token expiry check
axios.interceptors.response.use(
    response => response,
    error => {
        const originalConfig = error.config;
        if (error?.response?.status === 401 && !originalConfig._retry) {

            originalConfig._retry = true;

            if (originalConfig.url === `${apiUrl.slice(0, 43)}/token/refresh/`) {
                store.commit('auth/SET_AUTH', {login: false});
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject(error);
            }

            const refreshToken = localStorage.getItem("refresh_token") || ""
            if (!refreshToken) {
                store.commit('auth/SET_AUTH', {login: false});
                return Promise.reject(error);
            }

            axios.post(`${apiUrl}auth/refresh/`, {refresh: refreshToken}).then(
                res => {
                    if (res.data) {
                        localStorage.setItem("access_token", res.data.access);
                        store.commit('auth/SET_AUTH', {login: true});
                        return axios(originalConfig)
                    }
                }
            ).catch(error => {
                store.commit('auth/SET_AUTH', {login: false});
                return Promise.reject(error);
            })
        } else {
            return Promise.reject(error);
        }
    }
)

export default axios;
