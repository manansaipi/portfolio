import React, { useEffect, useState, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { Outlet, useLocation, useNavigate } from "react-router";

import CustomCursor from "@components/ui/CustomCursor/CustomCursor";
import PreLoader from "@components/layout/PreLoader/PreLoader";

import Navbar from "@components/layout/Navbar/Navbar";
import Home from "@pages/Home/Home";
import Footer from "@components/layout/Footer/Footer";
import { AnimatePageTransition } from "@components/layout/PreLoader/AnimatePageTransition";

export const AppContext = React.createContext({});

const App = () => {
    const [entranceAnimationDone, setEntranceAnimationDone] = useState(false);
    const [theme, setTheme] = useState("dark");

    const location = useLocation();
    const preloaderRef = useRef();
    const navbarRef = useRef();
    const navigate = useNavigate();
    const lenis = useLenis();
    const headerContainerRef = useRef(); 

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
        // setEnabled(!enabled);
        // IMPORTANT TODO : HANDLE THE DEFAULT THEME SWITCH BUTTON , ID THE DEFAULT WAS LIGHT, THE BUTTON SHOULD ON THE RIGHT SIDE
        //TODO : ADD DEFAULT THEME BASED ON USER THEME SETTING
        //TODO : STORE USER PREFERENCED SETTING INTO LOCAL STORAGE

        // if (enabled) {
        //     document.documentElement.classList.add("dark");
        //     document.documentElement.classList.remove("light");
        // } else {
        //     document.documentElement.classList.add("light");
        //     document.documentElement.classList.remove("dark");
        // }

        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
    };

    return (
        <>
            <AppContext.Provider
                value={{
                    preloaderRef,
                    navbarRef,
                    handleButtonNavigation,
                    entranceAnimationDone,
                    headerContainerRef,
                    toggleTheme,
                    theme,
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
                </ReactLenis>
            </AppContext.Provider>
        </>
    );
};

export default App;
