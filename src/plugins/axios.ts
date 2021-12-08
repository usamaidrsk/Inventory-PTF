import axios, {AxiosRequestConfig} from 'axios';

const apiUrl = process.env.VUE_APP_API_URL || "https://inventory-pft.herokuapp.com/api/";
axios.defaults.baseURL = apiUrl;

axios.interceptors.request.use((request: AxiosRequestConfig): AxiosRequestConfig => {
        const token = localStorage.getItem('access_token');
        if (token)  request.headers = {...request.headers, authorization: `Bearer ${token}`};
        return request;
    }
);

export default axios;
