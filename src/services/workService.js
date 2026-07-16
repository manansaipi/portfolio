import api from "@services/api";
import works from "@constants/works";

let cachedWorksData = null;
let fetchWorksPromise = null;

export const getAllWorks = async () => {
    const isEmbed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'true';
    if (isEmbed) return works;

    if (cachedWorksData) return cachedWorksData;
    if (fetchWorksPromise) return fetchWorksPromise;

    fetchWorksPromise = (async () => {
        try {
            const response = await api.get("/api/experiences/");
            cachedWorksData = response.data;
            return cachedWorksData;
        } catch (error) {
            console.warn("Failed to fetch works from API, falling back to constant data.", error.message);
            return works;
        } finally {
            fetchWorksPromise = null;
        }
    })();
    
    return fetchWorksPromise;
};