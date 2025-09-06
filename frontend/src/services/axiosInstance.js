import axios from "axios";
import store from "../store/store.js";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_NODE_URI,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.token.accessToken;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

export default axiosInstance;