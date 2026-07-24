import React, { useState, useEffect } from "react";
import { getLocalPhotos, deleteLocalPhoto, getCloudinaryPhotos, deleteCloudinaryPhoto } from "../../../services/upload";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AdminPhotos = () => {
    const [subTab, setSubTab] = useState("local");
    const [localPhotos, setLocalPhotos] = useState([]);
    const [cloudinaryPhotos, setCloudinaryPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPhotos = async () => {
        setLoading(true);
        setError(null);
        try {
            if (subTab === "local") {
                const data = await getLocalPhotos();
                setLocalPhotos(data);
            } else {
                const data = await getCloudinaryPhotos();
                setCloudinaryPhotos(data);
            }
        } catch (err) {
            console.error("Error fetching photos", err);
            setError("Failed to fetch photos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, [subTab]);

    const handleDeleteLocal = async (filename) => {
        if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;
        try {
            await deleteLocalPhoto(filename);
            setLocalPhotos(prev => prev.filter(p => p.filename !== filename));
        } catch (err) {
            console.error("Failed to delete local photo", err);
            alert("Failed to delete photo.");
        }
    };

    const handleDeleteCloudinary = async (publicId) => {
        if (!window.confirm(`Are you sure you want to delete this Cloudinary photo?`)) return;
        try {
            await deleteCloudinaryPhoto(publicId);
            setCloudinaryPhotos(prev => prev.filter(p => p.public_id !== publicId));
        } catch (err) {
            console.error("Failed to delete cloudinary photo", err);
            alert("Failed to delete photo.");
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Manage Photos</h2>
            <div className="flex gap-4 mb-6 border-b border-light-dark pb-2">
                <button 
                    className={`px-4 py-2 cursor-none shrink-0 ${subTab === 'local' ? 'font-bold border-b-2 border-primary text-primary' : 'opacity-50'}`} 
                    onClick={() => setSubTab('local')}
                >
                    Local Storage
                </button>
                <button 
                    className={`px-4 py-2 cursor-none shrink-0 ${subTab === 'cloudinary' ? 'font-bold border-b-2 border-primary text-primary' : 'opacity-50'}`} 
                    onClick={() => setSubTab('cloudinary')}
                >
                    Cloudinary
                </button>
                <button onClick={fetchPhotos} className="ml-auto px-4 py-2 text-sm border border-light-dark rounded hover:bg-light-dark transition-colors cursor-none">
                    Refresh
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {loading ? (
                <div className="text-center py-10 opacity-70 animate-pulse">Loading photos...</div>
            ) : subTab === "local" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {localPhotos.length === 0 && <p className="col-span-full opacity-70">No local photos found.</p>}
                    {localPhotos.map((photo) => (
                        <div key={photo.filename} className="border border-light-dark rounded overflow-hidden flex flex-col bg-background/50 transition-transform hover:scale-105">
                            <div className="h-32 bg-black flex items-center justify-center overflow-hidden">
                                <img src={`${API_URL}${photo.url}`} alt={photo.filename} className="object-cover w-full h-full" />
                            </div>
                            <div className="p-2 flex flex-col flex-1">
                                <p className="text-xs truncate mb-1" title={photo.filename}>{photo.filename}</p>
                                <p className="text-xs opacity-50 mb-2">{formatBytes(photo.size)}</p>
                                <div className="mt-auto">
                                    <button 
                                        className="text-xs w-full py-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors cursor-none"
                                        onClick={() => handleDeleteLocal(photo.filename)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {cloudinaryPhotos.length === 0 && <p className="col-span-full opacity-70">No Cloudinary photos found.</p>}
                    {cloudinaryPhotos.map((photo) => (
                        <div key={photo.public_id} className="border border-light-dark rounded overflow-hidden flex flex-col bg-background/50 transition-transform hover:scale-105">
                            <div className="h-32 bg-black flex items-center justify-center overflow-hidden">
                                <img src={photo.secure_url} alt={photo.public_id} className="object-cover w-full h-full" />
                            </div>
                            <div className="p-2 flex flex-col flex-1">
                                <p className="text-xs truncate mb-1" title={photo.public_id}>{photo.public_id.split('/').pop()}</p>
                                <p className="text-xs opacity-50 mb-2">{formatBytes(photo.bytes)} • {photo.format}</p>
                                <div className="mt-auto">
                                    <button 
                                        className="text-xs w-full py-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors cursor-none"
                                        onClick={() => handleDeleteCloudinary(photo.public_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPhotos;
