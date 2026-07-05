import api from "@services/api";

// --- WRITings (Blogs) ---
export const getWritings = async () => (await api.get("/api/writings")).data;
export const createWriting = async (data) => (await api.post("/api/writings", data)).data;
export const updateWriting = async (id, data) => (await api.put(`/api/writings/${id}`, data)).data;
export const deleteWriting = async (id) => (await api.delete(`/api/writings/${id}`)).data;

// --- EXPERIENCES (Works) ---
export const getExperiences = async () => (await api.get("/api/experiences")).data;
export const createExperience = async (data) => (await api.post("/api/experiences", data)).data;
export const updateExperience = async (id, data) => (await api.put(`/api/experiences/${id}`, data)).data;
export const deleteExperience = async (id) => (await api.delete(`/api/experiences/${id}`)).data;

// --- CERTIFICATES ---
export const getCertificates = async () => (await api.get("/api/certificates")).data;
export const createCertificate = async (data) => (await api.post("/api/certificates", data)).data;
export const deleteCertificate = async (id) => (await api.delete(`/api/certificates/${id}`)).data;

// --- COMMENTS ---
export const deleteComment = async (id) => (await api.delete(`/api/comments/${id}`)).data;

// --- UPLOAD ---
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};
