import api from '../api';

export const getTerminalLogs = async (skip = 0, limit = 5, search = '', isAiMode = 'all', country = 'all', ipAddress = 'all') => {
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
