import React, { useState } from "react";
import api from "@services/api";
import { AppContext } from "@/App";
import { useNavigate } from "react-router";

const AdminLogin = ({ onClose }) => {
    const { setIsAdmin } = React.useContext(AppContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const response = await api.post("/api/auth/login", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            const token = response.data.access_token;
            localStorage.setItem("admin_token", token);
            setIsAdmin(true);
            onClose(); // Close the modal
        } catch (err) {
            setError(err.response?.data?.detail || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-auto">
            <div className="bg-light-dark p-8 rounded-lg w-full max-w-md shadow-2xl border border-light-dark">
                <h2 className="text-3xl font-bold mb-6 text-primary">Admin Login</h2>
                
                {error && <div className="bg-red-500/10 text-red-500 p-3 mb-4 rounded border border-red-500/20">{error}</div>}
                
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="p-3 bg-background rounded outline-none border border-light-dark text-primary focus:border-primary"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="p-3 bg-background rounded outline-none border border-light-dark text-primary focus:border-primary"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    
                    <div className="flex gap-4 mt-2">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="flex-1 bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition-colors"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 border border-light-dark text-primary font-bold py-3 rounded hover:bg-light-dark transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
