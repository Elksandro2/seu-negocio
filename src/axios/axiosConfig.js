import axios from "axios";

export const apiAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

apiAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});