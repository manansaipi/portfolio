import React, { useState, useEffect } from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { useNavigate } from "react-router";

import AdminWritings from "./components/AdminWritings";
import AdminExperiences from "./components/AdminExperiences";
import AdminCertificates from "./components/AdminCertificates";

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("writings");

    useEffect(() => {
        // Enable admin mode for the rest of the site (for inline edits/deletes)
        localStorage.setItem("isAdmin", "true");
    }, []);

    const exitAdmin = () => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("admin_token");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background text-primary px-5 md:px-20 py-20 cursor-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold">Secret Admin Panel</h1>
                <div className="flex gap-4">
                    <button onClick={() => navigate("/")} className="px-4 py-2 border rounded cursor-none hover:bg-light-dark transition-colors">Back to Website</button>
                    <PrimaryButton label="Exit Admin Mode" handleOnClick={exitAdmin} />
                </div>
            </div>
            
            <div className="flex gap-4 mb-5 border-b border-light-dark pb-2">
                <button className={`px-4 py-2 cursor-none ${activeTab === 'writings' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('writings')}>Writings</button>
                <button className={`px-4 py-2 cursor-none ${activeTab === 'experiences' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('experiences')}>Experiences</button>
                <button className={`px-4 py-2 cursor-none ${activeTab === 'certificates' ? 'font-bold border-b-2 border-primary' : 'opacity-50'}`} onClick={() => setActiveTab('certificates')}>Certificates</button>
            </div>

            <div className="p-10 border border-light-dark rounded-md">
                {activeTab === "writings" && <AdminWritings />}
                {activeTab === "experiences" && <AdminExperiences />}
                {activeTab === "certificates" && <AdminCertificates />}
            </div>
        </div>
    );
};

export default AdminPanel;
