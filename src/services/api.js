import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://13.239.57.110:10000/api",
});

export default api;
