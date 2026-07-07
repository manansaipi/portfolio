import React, { useEffect, useState, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { Outlet, useLocation, useNavigate } from "react-router";

import CustomCursor from "@components/ui/CustomCursor/CustomCursor";
import PreLoader from "@components/layout/PreLoader/PreLoader";

import Navbar from "@components/layout/Navbar/Navbar";
import Home from "@pages/Home/Home";
import Footer from "@components/layout/Footer/Footer";
import { AnimatePageTransition } from "@components/layout/PreLoader/AnimatePageTransition";
import AdminLogin from "@components/ui/AdminLogin/AdminLogin";
import FloatingAdminButton from "@components/ui/FloatingAdminButton/FloatingAdminButton";
import TerminalFloating from "@components/ui/Terminal/TerminalFloating";

export const AppContext = React.createContext({});

const App = () => {
    const [entranceAnimationDone, setEntranceAnimationDone] = useState(false);
    const [theme, setTheme] = useState("dark");
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const location = useLocation();
    const preloaderRef = useRef();
    const navbarRef = useRef();
    const navigate = useNavigate();
    const lenis = useLenis();
    const headerContainerRef = useRef(); 

    useEffect(() => {
        setIsAdmin(localStorage.getItem("isAdmin") === "true");
        const handleStorage = () => setIsAdmin(localStorage.getItem("isAdmin") === "true");
        window.addEventListener('storage', handleStorage);
        
        // Check for login modal trigger from ProtectedRoute
        if (location.state?.showLogin) {
            setShowLoginModal(true);
            // Clear the state so it doesn't reopen on reload
            navigate(location.pathname, { replace: true, state: {} });
        }
        
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
    }, [navigate]);

    const isHome = location.pathname === "/" || location.pathname === "/home";

    function handleButtonNavigation(href) {
        if (location.pathname != href) {
            AnimatePageTransition({
                preloaderRef,
                navbarRef,
                lenis,
                href,
                navigate,
            });
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
    };

    return (
        <AppContext.Provider
            value={{
                preloaderRef,
                navbarRef,
                handleButtonNavigation,
                entranceAnimationDone,
                headerContainerRef,
                toggleTheme,
                theme,
                isAdmin,
                setIsAdmin,
            }}
        >
            <ReactLenis root>
                <CustomCursor />
                <PreLoader
                    setEntranceAnimationDone={setEntranceAnimationDone}
                    preloaderRef={preloaderRef}
                />
                <div ref={navbarRef}>
                    <Navbar />
                </div>
                <div className={isHome ? "" : "hidden"}>
                    <Home />
                </div>
                <div className={isHome ? "hidden" : ""}>
                    <Outlet />
                </div>

                {entranceAnimationDone && <Footer />}
                
                {showLoginModal && <AdminLogin onClose={() => setShowLoginModal(false)} />}
                <TerminalFloating />
                <FloatingAdminButton />
            </ReactLenis>
        </AppContext.Provider>
    );
};

export default App;
