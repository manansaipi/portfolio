import React, { useState, useEffect } from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { useNavigate } from "react-router";

import AdminWritings from "./components/AdminWritings";
import AdminExperiences from "./components/AdminExperiences";
import AdminCertificates from "./components/AdminCertificates";
import AdminTerminalLogs from "./components/AdminTerminalLogs";
import AdminUsers from "./components/AdminUsers";
import AdminPhotos from "./components/AdminPhotos";
import AdminGallery from "./components/AdminGallery";
import AdminMuseumChat from "./components/AdminMuseumChat";
const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("writings");

    useEffect(() => {
        // Enable admin mode for the rest of the site (for inline edits/deletes)
        localStorage.setItem("isAdmin", "true");
    }, []);

    const exitAdmin = () => {
        localStorage.removeItem("admin_token");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background text-primary px-4 sm:px-10 md:px-20 py-10 md:py-20 cursor-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <h1 className="text-2xl sm:text-4xl font-bold">Secret Admin Panel</h1>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <button onClick={() => navigate("/")} className="px-4 py-2 border rounded cursor-none hover:bg-light-dark transition-colors text-sm sm:text-base">Back to Website</button>
                    <PrimaryButton label="Exit Admin Mode" handleOnClick={exitAdmin} />
                </div>
            </div>
            
            <div className="flex gap-4 mb-5 border-b border-light-dark pb-2 overflow-x-auto">
                <button className={`px-4 py-2 cursor-none shrink-0 ${activeTab === 'writings' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('writings')}>Writings</button>
                <button className={`px-4 py-2 cursor-none shrink-0 ${activeTab === 'experiences' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('experiences')}>Experiences</button>
                <button className={`px-4 py-2 cursor-none shrink-0 ${activeTab === 'certificates' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('certificates')}>Certificates</button>
                <button className={`px-4 py-2 cursor-none shrink-0 ${activeTab === 'terminal' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('terminal')}>Terminal Logs</button>
                <button className={`px-4 py-2 cursor-none shrink-0 ${activeTab === 'users' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('users')}>Users</button>
                <button className={`px-4 py-2 cursor-none shrink-0 ${activeTab === 'photos' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('photos')}>Photos</button>
                <button className={`px-4 py-2 cursor-none shrink-0 ${activeTab === 'gallery' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('gallery')}>Scrapbook Gallery</button>
                <button className={`px-4 py-2 cursor-none shrink-0 ${activeTab === 'chat' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('chat')}>Museum Chat</button>
            </div>

            <div className="p-4 sm:p-6 md:p-10 border border-light-dark rounded-md">
                <div style={{ display: activeTab === "writings" ? "block" : "none" }}><AdminWritings /></div>
                <div style={{ display: activeTab === "experiences" ? "block" : "none" }}><AdminExperiences /></div>
                <div style={{ display: activeTab === "certificates" ? "block" : "none" }}><AdminCertificates /></div>
                <div style={{ display: activeTab === "terminal" ? "block" : "none" }}><AdminTerminalLogs /></div>
                <div style={{ display: activeTab === "users" ? "block" : "none" }}><AdminUsers /></div>
                <div style={{ display: activeTab === "photos" ? "block" : "none" }}><AdminPhotos /></div>
                <div style={{ display: activeTab === "gallery" ? "block" : "none" }}><AdminGallery /></div>
                <div style={{ display: activeTab === "chat" ? "block" : "none" }}><AdminMuseumChat /></div>
            </div>
        </div>
    );
};

export default AdminPanel;
