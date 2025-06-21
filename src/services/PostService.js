import api from "./api";

export const getCommentByPostId = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}/comments`)
        console.log("🚀 ~ getCommentByPostId ~ response.data:", response.data)
        return response.data
    } catch (error) {
        console.error("Failed to fetch data", error);
        throw error;        
    }
}

export const addComment = async (postId, comment, name = "Anonymous") => {
    try {
        const currentDate = new Date().toISOString(); 
        const response = await api.post(`/posts/comment`, {
            postId,
            comment,
            name,
            totalLikes: 0,
            createdAt: currentDate
        });
        return response.data;
    } catch (error) {
        console.error("Failed to add comment", error);
        throw error;        
    }
};
