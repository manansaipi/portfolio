import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const logTerminalCommand = async (inputText, isAiMode = false, responseText = null, executionTimeMs = null) => {
    const isEmbed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'true';
    if (import.meta.env.DEV || isEmbed) return;
    try {
        const payload = {
            input_text: inputText,
            is_ai_mode: isAiMode,
            response_text: responseText,
            execution_time_ms: executionTimeMs,
            screen_width: typeof window !== 'undefined' ? window.innerWidth : null,
            screen_height: typeof window !== 'undefined' ? window.innerHeight : null,
            language: typeof navigator !== 'undefined' ? navigator.language : null,
            referrer: typeof document !== 'undefined' ? document.referrer : null
        };
        await axios.post(`${API_URL}/api/terminal/logs/`, payload);
    } catch (error) {
        // Silently fail so the user experience is not disrupted
        console.warn("Failed to log terminal command", error);
    }
};

export const getTerminalLogs = async (skip = 0, limit = 10, search = '', isAiMode = 'all', country = 'all') => {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error("Not authorized");
    
    let url = `${API_URL}/api/terminal/logs/?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (isAiMode !== 'all') url += `&is_ai_mode=${isAiMode}`;
    if (country !== 'all') url += `&country=${encodeURIComponent(country)}`;

    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getTerminalCountries = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error("Not authorized");
    
    const response = await axios.get(`${API_URL}/api/terminal/logs/countries`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteTerminalLogs = async (logIds) => {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error("Not authorized");
    
    const response = await axios.delete(`${API_URL}/api/terminal/logs/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { log_ids: logIds }
    });
    return response.data;
};
