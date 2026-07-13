import api from './api';

export const getGuestbookEntries = async (skip = 0, limit = 100) => {
    const response = await api.get(`/api/guestbook/?skip=${skip}&limit=${limit}`);
    return response.data;
};

export const createGuestbookEntry = async (entryData) => {
    const response = await api.post('/api/guestbook/', entryData);
    return response.data;
};

export const updateGuestbookEntry = async (id, entryData) => {
    const response = await api.put(`/api/guestbook/${id}`, entryData);
    return response.data;
};

export const deleteGuestbookEntry = async (id) => {
    const response = await api.delete(`/api/guestbook/${id}`);
    return response.data;
};
