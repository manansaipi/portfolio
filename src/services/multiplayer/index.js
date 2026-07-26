import api from '../api';

export const getWsUrl = (roomId = "default", clientId = "") => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const wsProtocol = baseUrl.startsWith("https") ? "wss:" : "ws:";
  const hostAndPath = baseUrl.replace(/^https?:\/\//, "");
  return `${wsProtocol}//${hostAndPath}/api/multiplayer/ws/museum/${roomId}?client_id=${encodeURIComponent(clientId)}`;
};

export const getRoomVisitorCount = async (roomId = "default") => {
  try {
    const response = await api.get(`/api/multiplayer/rooms/${roomId}/count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return { room_id: roomId, count: 0 };
  }
};

export const getChatHistory = async (roomId = "default", skip = 0, limit = 50) => {
  try {
    const response = await api.get(`/api/multiplayer/chat/${roomId}?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return { messages: [], hasMore: false, total: 0 };
  }
};
