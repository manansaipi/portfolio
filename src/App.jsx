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
    const isEmbed = new URLSearchParams(window.location.search).get('embed') === 'true';
    const [entranceAnimationDone, setEntranceAnimationDone] = useState(isEmbed);
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
    }, [navigate]);

    // Separate useEffect to handle login modal trigger
    useEffect(() => {
        if (location.state?.showLogin) {
            setShowLoginModal(true);
            // Clear the state so it doesn't reopen on reload
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    // Auto-scroll logic for iframe embedding
    const isAutoScroll = new URLSearchParams(window.location.search).get('autoScroll') === 'true';
    useEffect(() => {
        if (isEmbed && isAutoScroll) {
            let scrollFrame;
            let delayTimeout;
            let isScrolling = true;
            
            const startScroll = () => {
                if (window.disableAutoScroll) {
                    scrollFrame = requestAnimationFrame(startScroll);
                    return;
                }
                const docHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
                const winHeight = window.innerHeight;
                
                if (window.scrollY + winHeight >= docHeight - 10) {
                    window.scrollTo(0, 0); // Reset
                    isScrolling = false;
                    delayTimeout = setTimeout(() => { isScrolling = true; }, 2000);
                } else if (isScrolling) {
                    window.scrollBy(0, 3); // Increased speed
                }
                scrollFrame = requestAnimationFrame(startScroll);
            };
            
            // Wait 2 seconds before starting auto-scroll
            delayTimeout = setTimeout(startScroll, 2000);

            return () => {
                if (scrollFrame) cancelAnimationFrame(scrollFrame);
                if (delayTimeout) clearTimeout(delayTimeout);
            };
        }
    }, [isEmbed, isAutoScroll]);

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
                {!isEmbed && <CustomCursor />}
                {!isEmbed && (
                    <PreLoader
                        setEntranceAnimationDone={setEntranceAnimationDone}
                        preloaderRef={preloaderRef}
                    />
                )}
                {!isEmbed && (
                    <div ref={navbarRef}>
                        <Navbar />
                    </div>
                )}
                <div className={isHome ? "" : "hidden"}>
                    <Home />
                </div>
                <div className={isHome ? "hidden" : ""}>
                    <Outlet />
                </div>

                {!isEmbed && entranceAnimationDone && <Footer />}
                
                {!isEmbed && showLoginModal && <AdminLogin onClose={() => setShowLoginModal(false)} />}
                <TerminalFloating isEmbed={isEmbed} />
                {!isEmbed && <FloatingAdminButton />}
            </ReactLenis>
        </AppContext.Provider>
    );
};

export default App;
