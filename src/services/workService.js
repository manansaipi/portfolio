import api from "@services/api";
import works from "@constants/works";

export const getAllWorks = async () => {
    try {
        const response = await api.get("/api/experiences");
        return response.data;
    } catch (error) {
        console.warn("Failed to fetch works from API, falling back to constant data.", error.message);
        return works;
    }
};