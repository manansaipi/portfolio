import { useState, useEffect, useCallback } from 'react';
import { getAdminChatMessages, deleteAdminChatMessage, updateAdminChatMessage, deleteAdminChatMessagesBulk } from '@services/admin';

const useAdminMuseumChat = (page = 0, pageSize = 10) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const fetchMessages = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAdminChatMessages(page * pageSize, pageSize);
            setMessages(data.messages || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error("Failed to fetch museum chat messages", err);
            setError("Failed to fetch museum chat messages");
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this chat message?")) return;
        setIsLoading(true);
        setError(null);
        try {
            await deleteAdminChatMessage(id);
            await fetchMessages();
        } catch (err) {
            console.error("Failed to delete chat message", err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Failed to delete chat message");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMessagesBulk = async (ids) => {
        if (!window.confirm(`Are you sure you want to delete ${ids.length} chat message(s)?`)) return false;
        setIsLoading(true);
        setError(null);
        try {
            await deleteAdminChatMessagesBulk(ids);
            await fetchMessages();
            return true;
        } catch (err) {
            console.error("Failed to bulk delete chat messages", err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Failed to bulk delete chat messages");
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateMessage = async (id, newText) => {
        if (!newText || !newText.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            await updateAdminChatMessage(id, newText);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, text: newText } : m));
        } catch (err) {
            console.error("Failed to edit chat message", err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Failed to edit chat message");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        total,
        isLoading,
        error,
        fetchMessages,
        handleDeleteMessage,
        handleDeleteMessagesBulk,
        handleUpdateMessage
    };
};

export default useAdminMuseumChat;
