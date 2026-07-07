import React, { useState, useEffect } from 'react';
import { getTerminalLogs } from '@services/terminalService';

const AdminTerminalLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getTerminalLogs();
                setLogs(data);
            } catch (err) {
                setError(err.message || "Failed to fetch logs");
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return <div>Loading terminal logs...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Terminal Logs</h2>
                <div className="text-sm text-gray-400">Total logs: {logs.length}</div>
            </div>
            
            <div className="overflow-x-auto max-h-[600px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-background z-10">
                        <tr className="border-b border-light-dark">
                            <th className="p-3">Time</th>
                            <th className="p-3">IP Address</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Input</th>
                            <th className="p-3">Response</th>
                            <th className="p-3">Mode</th>
                            <th className="p-3">Screen & Lang</th>
                            <th className="p-3">Referrer</th>
                            <th className="p-3">Device (User-Agent)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="p-4 text-center text-gray-500">No terminal logs found.</td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="border-b border-light-dark hover:bg-light-dark transition-colors">
                                    <td className="p-3 text-sm text-gray-400 whitespace-nowrap align-top">
                                        {new Date(log.created_at).toLocaleString()}
                                        <div className="text-xs text-gray-500 mt-1">{log.execution_time_ms ? `${log.execution_time_ms} ms` : ''}</div>
                                    </td>
                                    <td className="p-3 text-sm text-gray-400 whitespace-nowrap align-top">
                                        {log.ip_address || 'Unknown'}
                                    </td>
                                    <td className="p-3 text-sm text-gray-400 align-top">
                                        {log.city && log.country ? `${log.city}, ${log.country}` : '-'}
                                    </td>
                                    <td className="p-3 font-mono text-green-400 break-all align-top min-w-[150px]">
                                        {log.input_text}
                                    </td>
                                    <td className="p-3 text-sm text-gray-300 align-top min-w-[200px] max-w-xs overflow-y-auto max-h-32 block">
                                        {log.response_text || '-'}
                                    </td>
                                    <td className="p-3 align-top">
                                        {log.is_ai_mode ? (
                                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">AI</span>
                                        ) : (
                                            <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs border border-gray-500/30">System</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-sm text-gray-400 align-top whitespace-nowrap">
                                        {log.screen_width && log.screen_height ? `${log.screen_width}x${log.screen_height}` : '-'}<br/>
                                        <span className="text-xs text-gray-500">{log.language || ''}</span>
                                    </td>
                                    <td className="p-3 text-xs text-gray-500 align-top max-w-[150px] break-words">
                                        {log.referrer || '-'}
                                    </td>
                                    <td className="p-3 text-xs text-gray-500 align-top max-w-xs break-words">
                                        {log.user_agent || 'Unknown'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTerminalLogs;
