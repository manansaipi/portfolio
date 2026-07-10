import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const useAdminAuth = (setIsAdmin, setShowLoginModal) => {
    const navigate = useNavigate();

    useEffect(() => {
        setIsAdmin(!!localStorage.getItem("admin_token"));
        const handleStorage = () => setIsAdmin(!!localStorage.getItem("admin_token"));
        window.addEventListener('storage', handleStorage);
        
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
                e.preventDefault();
                const token = localStorage.getItem("admin_token");
                if (token) {
                    navigate('/dashboard-secret');
                } else {
                    setShowLoginModal(true);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('storage', handleStorage);
        }
    }, [navigate, setIsAdmin, setShowLoginModal]);
};
