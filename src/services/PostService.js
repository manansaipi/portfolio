import api from "./api";

export const getCommentByPostId = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}/comments`)
        return response.data
    } catch (error) {
        console.error("Failed to fetch data", error);
        throw error;        
    }
}

export const addComment = async (postId, comment, name = "Anonymous") => {
    try {
        const response = await api.post(`/posts/comment`, {
            postId,
            comment,
            name,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to add comment", error);
        throw error;        
    }
};

export const likeComment = async (commentId, isLiking) => {
    try {
        const response = await api.post(`/posts/comment/like`, {
            commentId,
            isLiking,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to like comment", error);
        throw error;        
    }
};
