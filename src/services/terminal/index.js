import { Environment } from '@react-three/drei';
import api from '../api';

export const logTerminalCommand = async (inputText, isAiMode = false, responseText = null, executionTimeMs = null, audioBase64 = null) => {
    const isEmbed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'true';
    if (import.meta.env.DEV ||isEmbed) return;
    try {
        const payload = {
            input_text: inputText,
            is_ai_mode: isAiMode,
            response_text: responseText,
            execution_time_ms: executionTimeMs,
            audio_base64: audioBase64,
            screen_width: typeof window !== 'undefined' ? window.innerWidth : null,
            screen_height: typeof window !== 'undefined' ? window.innerHeight : null,
            language: typeof navigator !== 'undefined' ? navigator.language : null,
            referrer: typeof document !== 'undefined' ? document.referrer : null
        };
        await api.post(`/api/terminal/logs/`, payload);
    } catch (error) {
        // Silently fail so the user experience is not disrupted
        console.warn("Failed to log terminal command", error);
    }
};

export const getTerminalLogs = async (skip = 0, limit = 10, search = '', isAiMode = 'all', country = 'all', ipAddress = 'all') => {
    let url = `/api/terminal/logs/?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (isAiMode !== 'all') url += `&is_ai_mode=${isAiMode}`;
    if (country !== 'all') url += `&country=${encodeURIComponent(country)}`;
    if (ipAddress !== 'all') url += `&ip_address=${encodeURIComponent(ipAddress)}`;

    const response = await api.get(url);
    return response.data;
};

export const getTerminalCountries = async () => {
    const response = await api.get(`/api/terminal/logs/countries`);
    return response.data;
};

export const getTerminalIps = async () => {
    const response = await api.get(`/api/terminal/logs/ips`);
    return response.data;
};

export const deleteTerminalLogs = async (logIds) => {
    const response = await api.delete(`/api/terminal/logs/`, {
        data: { log_ids: logIds }
    });
    return response.data;
};
