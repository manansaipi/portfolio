import React from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { useHomeMuseumPortal } from "./useHomeMuseumPortal";

import museumPc from "@/assets/img/museum/SS_MUSEUM_PC.png";
import museumMobile from "@/assets/img/museum/SS_MUSEUM_MOBILE.png";

const HomeMuseumPortal = () => {
    const { imageRef, handleEnterMuseum, preloadMuseum } = useHomeMuseumPortal();

    return (
        <div data-name="view" className="bg-light-dark text-primary pt-10 md:pt-20 px-5 md:px-10 lg:px-25 xl:px-30 transition-all">
            <div 
                className="relative w-full h-[80vh] md:h-[70vh] rounded-3xl overflow-hidden group shadow-2xl"
                onClick={handleEnterMuseum}
                onMouseEnter={preloadMuseum}
            >
                {/* The background image that expands */}
                <picture>
                    <source media="(max-width: 768px)" srcSet={museumMobile} />
                    <img 
                        ref={imageRef}
                        src={museumPc}
                        alt="3D Virtual Museum"
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </picture>

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 pointer-events-none">
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col items-center">
                        <div className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-widest text-white mb-4">
                            3D MUSEUM
                        </div>
                        <div className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg text-center">
                            Gallery of my photos, memories, and things I've captured.
                        </div>
                        
                        <div>
                            <PrimaryButton 
                                label="ENTER MUSEUM" 
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
