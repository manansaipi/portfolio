import api, { cachedGet, clearCache } from "@services/api";

// --- WRITings (Blogs) ---
export const getWritings = async () => await cachedGet("/api/writings", 60000, true);
export const createWriting = async (data) => {
    const res = await api.post("/api/writings", data);
    clearCache("/api/writings");
    return res.data;
};
export const updateWriting = async (id, data) => {
    const res = await api.put(`/api/writings/${id}`, data);
    clearCache("/api/writings");
    return res.data;
};
export const deleteWriting = async (id) => {
    const res = await api.delete(`/api/writings/${id}`);
    clearCache("/api/writings");
    return res.data;
};

// --- EXPERIENCES (Works) ---
export const getExperiences = async () => await cachedGet("/api/experiences", 60000, true);
export const createExperience = async (data) => {
    const res = await api.post("/api/experiences", data);
    clearCache("/api/experiences");
    return res.data;
};
export const updateExperience = async (id, data) => {
    const res = await api.put(`/api/experiences/${id}`, data);
    clearCache("/api/experiences");
    return res.data;
};
export const deleteExperience = async (id) => {
    const res = await api.delete(`/api/experiences/${id}`);
    clearCache("/api/experiences");
    return res.data;
};

// --- CERTIFICATES ---
export const getCertificates = async () => await cachedGet("/api/certificates", 60000, true);
export const createCertificate = async (data) => {
    const res = await api.post("/api/certificates", data);
    clearCache("/api/certificates");
    return res.data;
};
export const deleteCertificate = async (id) => {
    const res = await api.delete(`/api/certificates/${id}`);
    clearCache("/api/certificates");
    return res.data;
};

// --- COMMENTS ---
export const deleteComment = async (id) => (await api.delete(`/api/comments/${id}`)).data;
export const updateComment = async (id, data) => (await api.put(`/api/comments/${id}`, data)).data;

// --- UPLOAD ---
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};
