import React, { useState, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useLoginModalTrigger } from "./hooks/useLoginModalTrigger";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { AnimatePageTransition } from "@components/layout/PreLoader/AnimatePageTransition";
import CustomCursor from "@components/ui/CustomCursor/CustomCursor";
import PreLoader from "@components/layout/PreLoader/PreLoader";
import Footer from "@components/layout/Footer/Footer";
import AdminLogin from "@components/ui/AdminLogin/AdminLogin";
import Navbar from "@components/layout/Navbar/Navbar";
import FloatingAdminButton from "@components/ui/FloatingAdminButton/FloatingAdminButton";
import TerminalFloating from "@components/ui/Terminal/TerminalFloating";
import Home from "@pages/Home/Home";

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

    // Custom Hooks
    useAdminAuth(setIsAdmin, setShowLoginModal);
    useLoginModalTrigger(setShowLoginModal);
    useAutoScroll(isEmbed);

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
