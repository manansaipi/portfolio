import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success", duration = 3000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, exiting: false }]);

        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 300);
        }, duration);
    }, []);

    const success = useCallback((msg) => addToast(msg, "success"), [addToast]);
    const error = useCallback((msg) => addToast(msg, "error"), [addToast]);
    const info = useCallback((msg) => addToast(msg, "info"), [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto px-5 py-3 rounded-lg shadow-2xl text-sm font-medium backdrop-blur-md border transition-all duration-300
                            ${toast.exiting ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"}
                            ${toast.type === "success" ? "bg-emerald-500/90 text-white border-emerald-400/30" : ""}
                            ${toast.type === "error" ? "bg-red-500/90 text-white border-red-400/30" : ""}
                            ${toast.type === "info" ? "bg-blue-500/90 text-white border-blue-400/30" : ""}
                        `}
                    >
                        <div className="flex items-center gap-2">
                            {toast.type === "success" && <span>✓</span>}
                            {toast.type === "error" && <span>✕</span>}
                            {toast.type === "info" && <span>ℹ</span>}
                            {toast.message}
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
