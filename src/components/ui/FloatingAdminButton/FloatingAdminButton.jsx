import React from "react";
import { AppContext } from "@/App";
import { useNavigate } from "react-router";
import { MdAdminPanelSettings } from "react-icons/md";

const FloatingAdminButton = () => {
    const { isAdmin } = React.useContext(AppContext);
    const navigate = useNavigate();

    if (!isAdmin) return null;

    return (
        <div
            onClick={() => navigate("/dashboard-secret")}
            className="fixed bottom-6 left-6 z-[998] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-none hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg group"
            title="Admin Dashboard"
        >
            <MdAdminPanelSettings size={22} className="text-white/70 group-hover:text-white transition-colors" />
        </div>
    );
};

export default FloatingAdminButton;
