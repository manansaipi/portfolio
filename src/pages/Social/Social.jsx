import React from "react";
import InstagramStats from "@/components/ui/Instagram/InstagramStats";
import InstagramFeed from "@/components/ui/Instagram/InstagramFeed";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import CustomCursor from "@/components/ui/CustomCursor/CustomCursor";

const Social = () => {
    useDocumentTitle("Social | Abdul Mannan Saipi");

    return (
        <>
            <CustomCursor />
            <div className="bg-light-dark text-primary min-h-screen pt-[20vh] overflow-x-hidden">
                <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 pb-40">
                    <div className="flex flex-col items-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">SOCIAL UPDATES</h1>
                        <p className="text-white/60 max-w-2xl text-center text-lg md:text-xl">
                            Follow my journey, latest projects, and updates directly from my Instagram.
                        </p>
                    </div>
                    <InstagramStats />
                    <InstagramFeed limit={12} />
                </div>
            </div>
        </>
    );
};

export default Social;
