import React, { useState, useEffect } from 'react';
import useAdminMuseumChat from './useAdminMuseumChat';

const AdminMuseumChat = () => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const { messages, total, isLoading, error, fetchMessages, handleDeleteMessage, handleDeleteMessagesBulk, handleUpdateMessage } = useAdminMuseumChat(page, pageSize);

    // Clear selection when page or pageSize changes
    useEffect(() => {
        setSelectedMessages([]);
    }, [page, pageSize]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedMessages(messages.map(msg => msg.id));
        } else {
            setSelectedMessages([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedMessages.includes(id)) {
            setSelectedMessages(selectedMessages.filter(msgId => msgId !== id));
        } else {
            setSelectedMessages([...selectedMessages, id]);
        }
    };

    const onBulkDelete = async () => {
        if (selectedMessages.length === 0) return;
        setIsDeletingBulk(true);
        const success = await handleDeleteMessagesBulk(selectedMessages);
        if (success) {
            setSelectedMessages([]);
            if (selectedMessages.length === messages.length && page > 0) {
                setPage(page - 1);
            }
        }
        setIsDeletingBulk(false);
    };

    const startEdit = (msg) => {
        setEditingId(msg.id);
        setEditText(msg.text);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const saveEdit = async (id) => {
        if (!editText.trim()) return;
        await handleUpdateMessage(id, editText);
        setEditingId(null);
        setEditText('');
    };

    const totalPages = Math.ceil(total / pageSize);
    const allSelected = messages.length > 0 && selectedMessages.length === messages.length;

    return (
        <div className="flex flex-col gap-10">
            {error && <div className="text-red-500 bg-red-500/10 p-4 rounded border border-red-500/20">{error}</div>}
            
            <div className="bg-light-dark p-6 rounded-lg overflow-x-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <span>Live Museum Chat Room</span>
                    </h2>
                    <div className="flex items-center gap-4 whitespace-nowrap">
                        <button 
                            onClick={() => fetchMessages()} 
                            disabled={isLoading}
                            className="px-3 py-1.5 border border-primary/40 rounded text-sm font-bold hover:bg-primary/10 transition-colors cursor-none"
                        >
                            {isLoading ? "Refreshing..." : "Refresh Chat"}
                        </button>
                        <span className="text-sm font-normal text-color-text-hovering">Total Messages: {total}</span>
                        {selectedMessages.length > 0 && (
                            <button 
                                onClick={onBulkDelete}
                                disabled={isDeletingBulk || isLoading}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold transition-colors cursor-none disabled:opacity-50"
                            >
                                {isDeletingBulk ? 'Deleting...' : `Delete Selected (${selectedMessages.length})`}
                            </button>
                        )}
                    </div>
                </div>
                
                {isLoading && messages.length === 0 ? (
                    <div className="text-center py-10 opacity-50">Loading chat messages...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-primary/10">
                                <th className="p-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 accent-primary cursor-none"
                                    />
                                </th>
                                <th className="p-4 text-sm font-bold text-color-text-hovering uppercase tracking-wider">ID</th>
                                <th className="p-4 text-sm font-bold text-color-text-hovering uppercase tracking-wider">Sender</th>
                                <th className="p-4 text-sm font-bold text-color-text-hovering uppercase tracking-wider">Message</th>
                                <th className="p-4 text-sm font-bold text-color-text-hovering uppercase tracking-wider">Time</th>
                                <th className="p-4 text-sm font-bold text-color-text-hovering uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                                    <td className="p-4">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedMessages.includes(msg.id)}
                                            onChange={() => handleSelectOne(msg.id)}
                                            className="w-4 h-4 accent-primary cursor-none"
                                        />
                                    </td>
                                    <td className="p-4 text-color-text-hovering text-sm">#{msg.id}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span 
                                                className="w-3 h-3 rounded-full shrink-0" 
                                                style={{ backgroundColor: msg.senderColor || '#38bdf8' }}
                                            />
                                            <span className="font-bold text-primary">{msg.senderName}</span>
                                            {msg.senderIsAdmin && (
                                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-bold rounded uppercase tracking-wider">
                                                    Admin
                                                </span>
                                            )}
                                            {msg.system && (
                                                <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 text-[10px] font-bold rounded uppercase tracking-wider">
                                                    System
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 max-w-md">
                                        {editingId === msg.id ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    className="w-full bg-background border border-primary/40 rounded p-2 text-primary text-sm focus:outline-none focus:border-primary transition-colors cursor-none"
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-primary/90 break-words">{msg.text}</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-color-text-hovering text-sm whitespace-nowrap">{msg.timestamp}</td>
                                    <td className="p-4 text-right whitespace-nowrap">
                                        {editingId === msg.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => saveEdit(msg.id)}
                                                    className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded text-xs font-bold transition-colors cursor-none"
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    onClick={cancelEdit}
                                                    className="px-3 py-1 bg-white/10 text-white/70 hover:bg-white/20 rounded text-xs font-bold transition-colors cursor-none"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => startEdit(msg)}
                                                    className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-background rounded text-xs font-bold transition-colors cursor-none"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded text-xs font-bold transition-colors cursor-none"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-color-text-hovering italic">No chat messages found in database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                <div className="flex justify-between items-center mt-6 text-sm text-color-text-hovering">
                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select 
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(0);
                            }}
                            className="bg-[#0a0a0a] border border-light-dark rounded px-2 py-1 text-primary cursor-none"
                        >
                            <option value={5}>5</option>
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
                                disabled={page === 0 || isLoading}
                                className="px-3 py-1 border border-light-dark rounded hover:bg-light-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-none"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages - 1 || isLoading || totalPages === 0}
                                className="px-3 py-1 border border-light-dark rounded hover:bg-light-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-none"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMuseumChat;
