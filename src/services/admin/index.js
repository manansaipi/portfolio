import api from "../api";

// --- WRITings (Blogs) ---
export const getWritings = async () => (await api.get("/api/writings/")).data;
export const createWriting = async (data) => {
    const res = await api.post("/api/writings/", data);
    return res.data;
};
export const updateWriting = async (id, data) => {
    const res = await api.put(`/api/writings/${id}`, data);
    return res.data;
};
export const deleteWriting = async (id) => {
    const res = await api.delete(`/api/writings/${id}`);
    return res.data;
};

// --- EXPERIENCES (Works) ---
export const getExperiences = async () => (await api.get("/api/experiences/")).data;
export const createExperience = async (data) => {
    const res = await api.post("/api/experiences/", data);
    return res.data;
};
export const updateExperience = async (id, data) => {
    const res = await api.put(`/api/experiences/${id}`, data);
    return res.data;
};
export const deleteExperience = async (id) => {
    const res = await api.delete(`/api/experiences/${id}`);
    return res.data;
};

// --- CERTIFICATES ---
export const getCertificates = async () => (await api.get("/api/certificates/")).data;
export const createCertificate = async (data) => {
    const res = await api.post("/api/certificates/", data);
    return res.data;
};
export const updateCertificate = async (id, data) => {
    const res = await api.put(`/api/certificates/${id}`, data);
    return res.data;
};
export const deleteCertificate = async (id) => {
    const res = await api.delete(`/api/certificates/${id}`);
    return res.data;
};

// --- COMMENTS ---
export const deleteComment = async (id) => {
    const res = await api.delete(`/api/comments/${id}`);
    return res.data;
};
export const updateComment = async (id, data) => {
    const res = await api.put(`/api/comments/${id}`, data);
    return res.data;
};

// --- UPLOAD ---
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

// --- USERS ---
export const getUsers = async () => (await api.get("/api/users")).data;
export const createUser = async (data) => {
    const res = await api.post("/api/users", data);
    return res.data;
};
export const deleteUser = async (id) => {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
};
