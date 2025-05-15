import React, { useEffect, useState } from "react";

const HoveredImages = ({ imageContainerRef, imageHolderRef, works }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const moveCursor = (e) => {
            // set delay to have magnetic effect
            setTimeout(() => {
                setPosition({ x: e.clientX, y: e.clientY });
            }, 150);
        };
        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []);

    return (
        <div
            ref={imageContainerRef}
            className="w-[400px] h-[350px] fixed overflow-hidden"
            style={{
                top: `${position.y - 160}px`,
                left: `${position.x - 180}px`,
                pointerEvents: "none",
            }}
        >
            <div ref={imageHolderRef} className="flex flex-col">
                {works.map((work) => (
                    <div
                        key={work.id}
                        className={` ${work.bgColor} w-[400px] h-[350px]`}
                    >
                        <div className="px-10 w-full h-full flex items-center justify-center">
                            <img
                                src={work.img}
                                alt="certificate"
                                className="shadow-lg shadow-black"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HoveredImages;
