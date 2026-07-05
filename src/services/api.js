import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
    timeout: 3000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;

const cache = new Map();

export const cachedGet = async (url, duration = 60000, force = false) => {
    if (!force && cache.has(url)) {
        const { data, timestamp } = cache.get(url);
        if (Date.now() - timestamp < duration) {
            return data;
        }
    }
    const response = await api.get(url);
    cache.set(url, { data: response.data, timestamp: Date.now() });
    return response.data;
};

export const clearCache = (url) => {
    if (url) cache.delete(url);
    else cache.clear();
};
