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
    const [animationDone, setAnimationDone] = useState(false);
    const location = useLocation();
    const preloaderRef = useRef();
    const navigate = useNavigate();

    const isHome = location.pathname === "/" || location.pathname === "/home";

    function handleButtonNavigation(href) {
        AnimatePageTransition({
            preloaderRef,
            href,
            navigate,
        });
    }

    return (
        <>
            <AppContext.Provider value={{ preloaderRef }}>
                <ReactLenis root>
                    <CustomCursor />
                    <PreLoader
                        setAnimationDone={setAnimationDone}
                        preloaderRef={preloaderRef}
                    />
                    <Navbar />
                    <div className={isHome ? "" : "hidden"}>
                        <Home
                            animationDone={animationDone}
                            handleButtonNavigation={handleButtonNavigation}
                        />
                    </div>
                    <div className={isHome ? "hidden" : ""}>
                        <Outlet />
                    </div>

                    {animationDone ? (
                        <Footer
                            handleButtonNavigation={handleButtonNavigation}
                        />
                    ) : (
                        <></>
                    )}
                </ReactLenis>
            </AppContext.Provider>
        </>
    );
};

export default App;
// TODO : WEB PORTOFOLIO TERMINAL/CMD STYLEhttps://www.youtube.com/watch?v=L-7Rofs-zTM&ab_channel=MuhammadIqbalAlaydrus
// WEBSITE AWARD https://dennissnellenberg.com/ (https://blog.olivierlarose.com/tutorials/awwwards-landing-page), https://zentry.com/
// WEB IDEA : https://minimal.gallery/, https://www.darkmodedesign.com/, https://www.cssdesignawards.com/sites/above-the-clouds-111w-57s/47359/,  , https://www.awwwards.com/#nominees,
// https://justgowiththeflow.com/
// https://www.chiara-hofmayer.de/en
// https://alvalens-k2ihpke38-alvalens-projects.vercel.app/projects/archive
// website idea : https://readymag.com/examples/portfolio ,
//  https://michaelwatchmaker.com/about/
