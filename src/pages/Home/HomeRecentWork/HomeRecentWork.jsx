import React, { useEffect, useState, useRef, useLayoutEffect } from "react";

import gsap from "gsap";

import Works from "./Works";
import ListRecentWorkMobile from "./ListRecentWorkMobile";
import ListRecentWorkLarge from "./ListRecentWorkLarge";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";

const HomeRecentWork = ({ handleButtonNavigation }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hoveredIndex, setHoveredIndex] = useState(0);

    const imageContainerRef = useRef();
    const imageHolderRef = useRef();

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

    useLayoutEffect(() => {
        if (imageContainerRef.current) {
            gsap.set(imageContainerRef.current, { scale: 0 });
        }
    }, []);

    function handleHover(eventName, index) {
        if (eventName == "enter") {
            setHoveredIndex(index);
            gsap.to(imageContainerRef.current, {
                scale: 1,
                duration: 0.5,
                ease: "expoScale(0.5,7, none)",
            });

            gsap.to(imageHolderRef.current, {
                y: index * -350,
                duration: 0.6,
                ease: "expoScale(0.5,7, none)",
            });
        } else {
            gsap.fromTo(
                imageContainerRef.current,
                {
                    scale: 1,
                },
                { scale: 0, duration: 0.5, ease: "expoScale(0.5,7, none)" }
            );
        }
    }

    return (
        <div className="  bg-light-dark px-5 md:px-10 lg:px-25 xl:px-30">
            {/* mobile-medium size */}
            <ListRecentWorkMobile works={Works} />

            {/* large size */}
            <ListRecentWorkLarge works={Works} handleHover={handleHover} />

            <div className="flex justify-center text-primary py-20">
                <PrimaryButton
                    handleOnClick={() => handleButtonNavigation("/work")}
                    label={"MORE WORK"}
                />
            </div>

            {/* hovered image */}
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
                    {Works.map((work, index) => (
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
        </div>
    );
};

export default HomeRecentWork;
