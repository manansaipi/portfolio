import api from "../api";

export const getLocalPhotos = async () => {
    const response = await api.get("/api/upload/local");
    return response.data;
};

export const deleteLocalPhoto = async (filename) => {
    const response = await api.delete("/api/upload/local", { data: { filename } });
    return response.data;
};

export const getCloudinaryPhotos = async () => {
    const response = await api.get("/api/upload/cloudinary");
    return response.data;
};

export const deleteCloudinaryPhoto = async (publicId) => {
    const response = await api.delete("/api/upload/cloudinary", { data: { public_id: publicId } });
    return response.data;
};
