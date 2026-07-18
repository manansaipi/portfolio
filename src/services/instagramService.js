import api from "@services/api";

export const getInstagramStats = async () => {
    try {
        const response = await api.get("/api/instagram/stats");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Instagram stats", error);
        return null;
    }
};

export const getInstagramFeed = async (limit = 9) => {
    try {
        const response = await api.get(`/api/instagram/feed?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Instagram feed", error);
        return [];
    }
};

export const getInstagramComments = async (mediaId) => {
    try {
        const response = await api.get(`/api/instagram/comments/${mediaId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Instagram comments", error);
        return [];
    }
};
