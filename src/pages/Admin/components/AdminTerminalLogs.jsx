import React, { useState, useEffect } from 'react';
import { getTerminalLogs, deleteTerminalLogs, getTerminalCountries } from '@services/terminalService';

const AdminTerminalLogs = () => {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter states
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterAiMode, setFilterAiMode] = useState("all");
    const [filterCountry, setFilterCountry] = useState("all");
    const [availableCountries, setAvailableCountries] = useState([]);

    // Fetch unique countries on mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const countries = await getTerminalCountries();
                setAvailableCountries(countries);
            } catch (err) {
                console.error("Failed to fetch countries", err);
            }
        };
        fetchCountries();
    }, []);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await getTerminalLogs(page * pageSize, pageSize, debouncedSearch, filterAiMode, filterCountry);
            setLogs(data.items);
            setTotal(data.total);
            // Clear selection on page change or refresh
            setSelectedLogs([]);
        } catch (err) {
            setError(err.message || "Failed to fetch logs");
        } finally {
            setLoading(false);
        }
    };

    // Reset page to 0 when filters change
    useEffect(() => {
        setPage(0);
    }, [debouncedSearch, filterAiMode, filterCountry, pageSize]);

    useEffect(() => {
        fetchLogs();
    }, [page, pageSize, debouncedSearch, filterAiMode, filterCountry]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedLogs(logs.map(log => log.id));
        } else {
            setSelectedLogs([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedLogs.includes(id)) {
            setSelectedLogs(selectedLogs.filter(logId => logId !== id));
        } else {
            setSelectedLogs([...selectedLogs, id]);
        }
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedLogs.length} log(s)?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteTerminalLogs(selectedLogs);
            setSelectedLogs([]);
            if (selectedLogs.length === logs.length && page > 0) {
                setPage(page - 1);
            } else {
                fetchLogs();
            }
        } catch (err) {
            alert(err.message || "Failed to delete logs");
        } finally {
            setIsDeleting(false);
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    if (loading && logs.length === 0) return <div>Loading terminal logs...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const allSelected = logs.length > 0 && selectedLogs.length === logs.length;

    return (
        <div>
            <div className="flex flex-col gap-6 mb-6">
                <h2 className="text-2xl font-bold">Terminal Logs</h2>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto flex-1">
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border border-light-dark rounded px-3 py-1.5 w-full md:w-64 focus:outline-none focus:border-primary text-sm"
                    />
                    
                    <select 
                        value={filterAiMode}
                        onChange={(e) => setFilterAiMode(e.target.value)}
                        className="bg-transparent border border-light-dark rounded px-3 py-1.5 focus:outline-none text-sm"
                    >
                        <option value="all">All Modes</option>
                        <option value="ai">AI Mode</option>
                        <option value="system">System Mode</option>
                    </select>

                    <select 
                        value={filterCountry}
                        onChange={(e) => setFilterCountry(e.target.value)}
                        className="bg-transparent border border-light-dark rounded px-3 py-1.5 focus:outline-none text-sm max-w-[200px]"
                    >
                        <option value="all">All Countries</option>
                        {availableCountries.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">Total logs: {total}</div>
                    {selectedLogs.length > 0 && (
                        <button 
                            onClick={handleDeleteSelected}
                            disabled={isDeleting}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm disabled:opacity-50"
                        >
                            {isDeleting ? 'Deleting...' : `Delete Selected (${selectedLogs.length})`}
                        </button>
                    )}
                </div>
            </div>
            </div>
            
            <div className="overflow-x-auto max-h-[600px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full text-left border-collapse relative">
                    <thead className="sticky top-0 bg-background z-10 shadow-sm shadow-light-dark">
                        <tr className="border-b border-light-dark">
                            <th className="p-3 w-10">
                                <input 
                                    type="checkbox" 
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                    className="cursor-pointer"
                                />
                            </th>
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
                                <td colSpan="10" className="p-4 text-center text-gray-500">No terminal logs found.</td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="border-b border-light-dark hover:bg-light-dark transition-colors">
                                    <td className="p-3">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedLogs.includes(log.id)}
                                            onChange={() => handleSelectOne(log.id)}
                                            className="cursor-pointer"
                                        />
                                    </td>
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

            <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select 
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(0);
                        }}
                        className="bg-transparent border border-light-dark rounded px-2 py-1"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                
                <div className="flex items-center gap-4">
                    <span>
                        {total === 0 ? '0' : page * pageSize + 1} - {Math.min((page + 1) * pageSize, total)} of {total}
                    </span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0 || loading}
                            className="px-3 py-1 border border-light-dark rounded hover:bg-light-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>
                        <button 
                            onClick={() => setPage(page + 1)}
                            disabled={page >= totalPages - 1 || loading}
                            className="px-3 py-1 border border-light-dark rounded hover:bg-light-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTerminalLogs;
