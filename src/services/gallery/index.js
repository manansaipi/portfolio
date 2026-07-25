import api from "../api";

export const getGalleryMedia = async () => {
    const res = await api.get("/api/gallery/");
    return res.data;
};

export const createGalleryMedia = async (data) => {
    const res = await api.post("/api/gallery/", data);
    return res.data;
};

export const updateGalleryMedia = async (id, data) => {
    const res = await api.put(`/api/gallery/${id}`, data);
    return res.data;
};

export const deleteGalleryMedia = async (id) => {
    const res = await api.delete(`/api/gallery/${id}`);
    return res.data;
};

export const getGalleryCategories = async () => {
    const res = await api.get("/api/gallery/categories");
    return res.data;
};

export const updateGalleryCategory = async (slug, data) => {
    const res = await api.put(`/api/gallery/categories/${slug}`, data);
    return res.data;
};
