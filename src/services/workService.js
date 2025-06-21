import api from "./api";

export const getAllWorks = async () => {
    try {
        const response = await api.get("/works")
        return response.data
    } catch (error) {
        console.error("Failed to fetch data", error);
        throw error;        
    }
}