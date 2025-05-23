import React, { useEffect, useState } from "react";

const HoveredImages = ({ imageContainerRef, imageHolderRef, datas }) => {
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
            className="hidden lg:block w-[400px] h-[350px] fixed overflow-hidden"
            style={{
                top: `${position.y - 160}px`,
                left: `${position.x - 180}px`,
                pointerEvents: "none",
            }}
        >
            <div ref={imageHolderRef} className="flex flex-col">
                {datas.map((data, index) => (
                    <div
                        key={index}
                        className={` ${data.bgColor} w-[400px] h-[350px]`}
                    >
                        <div className="px-10 w-full h-full flex items-center justify-center">
                            <img
                                src={data.img}
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
