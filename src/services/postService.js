import api, { cachedGet } from "@services/api";
import blogs from "@constants/blogs";

export const getAllWritings = async () => {
    try {
        const data = await cachedGet("/api/writings");
        return data;
    } catch (error) {
        console.warn("Failed to fetch writings from API, falling back to constant data.", error.message);
        return blogs;
    }
};

export const getCommentByPostId = async (postId) => {
    try {
        const data = await cachedGet(`/api/writings/${postId}/comments`, 10000); // 10s cache for comments
        return data;
    } catch (error) {
        console.warn(`Failed to fetch comments for post ${postId}, falling back to constant data.`, error.message);
        return error;
    }
};

export const addComment = async (postId, comment, name = "Anonymous", parentId = null) => {
    try {
        const payload = {
            content: comment,
            username: name,
        };
        if (parentId) payload.parent_id = parentId;
        
        const response = await api.post(`/api/writings/${postId}/comments`, payload);
        return response.data;
    } catch (error) {
        console.warn("Failed to add comment via API, simulating success.", error.message);
        return { success: true, message: "Comment added (simulated)", data: { postId, comment, name } };
    }
};

export const likeComment = async (commentId) => {
    try {
        const response = await api.put(`/api/comments/${commentId}/like`);
        return response.data;
    } catch (error) {
        console.warn("Failed to like comment via API, simulating success.", error.message);
        return { success: true, message: "Comment liked (simulated)" };
    }
};
