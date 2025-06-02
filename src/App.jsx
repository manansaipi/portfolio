import React, { useEffect, useState, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { Outlet, useLocation, useNavigate } from "react-router";

import CustomCursor from "./components/CustomCursor";
import PreLoader from "./components/PreLoader/PreLoader";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import { AnimatePageTransition } from "./components/PreLoader/AnimatePageTransition";

export const AppContext = React.createContext({});

const App = () => {
    const [entranceAnimationDone, setEntranceAnimationDone] = useState(false);
    const location = useLocation();
    const preloaderRef = useRef();
    const navbarRef = useRef();
    const navigate = useNavigate();
    const lenis = useLenis();

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

    return (
        <>
            <AppContext.Provider
                value={{ preloaderRef, navbarRef, handleButtonNavigation, entranceAnimationDone  }}
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
