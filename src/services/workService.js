import api from "@services/api";
import works from "@constants/works";

export const getAllWorks = async () => {
    const isEmbed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'true';
    if (isEmbed) return works;

    try {
        const response = await api.get("/api/experiences");
        return response.data;
    } catch (error) {
        console.warn("Failed to fetch works from API, falling back to constant data.", error.message);
        return works;
    }
};