import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const PreLoader = () => {
    const bgPreloaderRef = useRef();

    useEffect(() => {
        // Disable scrolling
        document.body.classList.add("overflow-hidden");

        const tl = gsap.timeline({
            onComplete: () => {
                // Re-enable scrolling when animation is done
                document.body.classList.remove("overflow-hidden");
                if (bgPreloaderRef.current) {
                    bgPreloaderRef.current.remove();
                }
            },
        });

        // tl.to(bgPreloaderRef.current, {
        // 	opacity: 0,
        // 	duration: 1.5,
        // 	delay: 7,
        // });
    }, []);

    return (
        <div
            ref={bgPreloaderRef}
            className="section fixed bg-black w-full z-5 scroll-d"
        ></div>
    );
};

export default PreLoader;
