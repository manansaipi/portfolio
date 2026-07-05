import api from "@services/api";
import works from "@constants/works";

export const getAllWorks = async () => {
    try {
        const data = (await api.get("/api/experiences")).data;
        return data;
    } catch (error) {
        console.warn("Failed to fetch works from API, falling back to constant data.", error.message);
        return works;
    }
};