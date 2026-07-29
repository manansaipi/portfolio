import React, { useRef, useContext } from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { AppContext } from "@/App";
import { useNavigate } from "react-router";
import { useLenis } from "lenis/react";
import { handleImageNavigation } from "@utils/navigationImageAnimation";

import museumPc from "@/assets/img/museum/SS_MUSEUM_PC.png";
import museumMobile from "@/assets/img/museum/SS_MUSEUM_MOBILE.png";

const HomeMuseumPortal = () => {
    const { navbarRef, preloaderRef } = useContext(AppContext);
    const lenis = useLenis();
    const navigate = useNavigate();
    const imageRef = useRef(null);

    const handleEnterMuseum = () => {
        if (!imageRef.current) return;
        handleImageNavigation("/museum", imageRef.current, navbarRef, preloaderRef, lenis, navigate);
    };

    return (
        <div className="bg-light-dark text-primary py-10 md:py-20 px-5 md:px-10 lg:px-25 xl:px-30 transition-all">
            <div 
                className="relative w-full h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
                onClick={handleEnterMuseum}
            >
                {/* The background image that expands */}
                <img 
                    ref={imageRef}
                    src={museumPc}
                    srcSet={`${museumMobile} 768w, ${museumPc} 1200w`}
                    sizes="(max-width: 768px) 100vw, 100vw"
                    alt="3D Virtual Museum"
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 pointer-events-none">
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col items-center">
                        <div className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-widest text-white mb-4">
                            3D MUSEUM
                        </div>
                        <div className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                            Step into a fully interactive multiplayer gallery experience.
                        </div>
                        
                        <div className="pointer-events-auto">
                            <PrimaryButton 
                                label="ENTER PORTAL" 
                                handleOnClick={handleEnterMuseum}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeMuseumPortal;
