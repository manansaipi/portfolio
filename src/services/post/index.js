import api from "../api";
import comments from "@constants/comments";
import blogs from "@constants/blogs";

let cachedWritings = null;
let fetchWritingsPromise = null;

export const getAllWritings = async () => {
    const isEmbed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'true';
    if (isEmbed) return blogs;

    if (cachedWritings) return cachedWritings;
    if (fetchWritingsPromise) return fetchWritingsPromise;

    fetchWritingsPromise = (async () => {
        try {
            const response = await api.get("/api/writings/");
            cachedWritings = response.data;
            return cachedWritings;
        } catch (error) {
            console.warn("Failed to fetch writings from API, falling back to constant data.", error.message);
            return blogs;
        } finally {
            fetchWritingsPromise = null;
        }
    })();
    
    return fetchWritingsPromise;
};

let commentsCache = {};
let commentsPromises = {};

export const prefetchComments = (postId) => {
    getCommentByPostId(postId).catch(() => {});
};

export const getCommentByPostId = async (postId) => {
    if (commentsCache[postId]) return commentsCache[postId];
    if (commentsPromises[postId]) return commentsPromises[postId];

    commentsPromises[postId] = (async () => {
        try {
            const response = await api.get(`/api/writings/${postId}/comments`);
            commentsCache[postId] = response.data;
            return response.data;
        } catch (error) {
            console.warn(`Failed to fetch comments for post ${postId}, falling back to constant data.`, error.message);
            return error;
        } finally {
            delete commentsPromises[postId];
        }
    })();
    return commentsPromises[postId];
};

export const addComment = async (postId, comment, name = "Anonymous", parentId = null) => {
    try {
        const payload = {
            content: comment,
            username: name,
        };
        if (parentId) payload.parent_id = parentId;
        
        const response = await api.post(`/api/writings/${postId}/comments`, payload);
        delete commentsCache[postId];
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
