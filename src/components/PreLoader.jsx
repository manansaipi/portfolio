import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const PreLoader = ({ setAnimationDone }) => {
    const bgPreloaderRef = useRef();

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                setAnimationDone(true); // Show the rest of the components

                if (bgPreloaderRef.current) {
                    bgPreloaderRef.current.remove();
                }
            },
        });

        tl.to(bgPreloaderRef.current, {
            opacity: 0,
            duration: 1.5,
            delay: 7,
        });
    }, [setAnimationDone]);

    return (
        <div
            ref={bgPreloaderRef}
            className="section fixed bg-black w-full z-5 scroll-d"
        ></div>
    );
};

export default PreLoader;
