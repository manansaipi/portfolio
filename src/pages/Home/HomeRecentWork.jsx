import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import galadinerlgsm from "../../assets/img/profiles/galadinerlgsm.JPEG";
import mattel from "../../assets/img/profiles/mattel.jpg";
import dpr from "../../assets/img/profiles/dpr.jpg";
import Magnet from "../../components/Magnet";
import TransitionLink from "../../components/Navbar/TransitionLink";
import { AppContext } from "../../App";
import gsap from "gsap";

const HomeRecentWork = () => {
    const { preloaderRef } = React.useContext(AppContext);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hoveredIndex, setHoveredIndex] = useState(0);

    const imageContainerRef = useRef();
    const imageHolderRef = useRef();

    const works = [
        {
            id: 1,
            company: "LG Sinar Mas",
            role: "Software Engineer",
            startDate: "Dec 2024",
            endDate: "Present",
            img: galadinerlgsm,
            bgColor: "bg-neutral-800",
            url: "",
        },
        {
            id: 2,
            company: "PT. \u00A0Mattel Indonesia",
            role: "Full Stack Developer",
            startDate: "Jan 2024",
            endDate: "Dec 2024",
            img: mattel,
            bgColor: "bg-neutral-400",
            url: "",
        },
        {
            id: 3,
            company: "Sekretariat Jendral DPR RI",
            role: "IT Programmer",
            startDate: "Aug 2023",
            endDate: "Dec 2023",
            img: dpr,
            bgColor: "bg-zinc-700",
            url: "",
        },
    ];

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
            <div className="flex flex-col md:flex-row lg:hidden gap-10">
                {works.slice(0, 2).map((work, index) => {
                    return (
                        <div
                            key={work.id}
                            data-name="view"
                            className="flex flex-col  gap-5 text-white h-full md:w-1/2 "
                        >
                            <div
                                className={`h-[50vh]  ${work.bgColor} pointer-events-none `}
                            >
                                <div className="px-5 w-full h-full flex items-center justify-center">
                                    <img
                                        className="max-h-[45vh] shadow-lg shadow-black transition-transform duration-500 ease-in-out group-hover:scale-110"
                                        src={work.img}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="pointer-events-none">
                                <div className="text-3xl">{work.company} </div>
                                <div className=" border-b-1 my-5"></div>
                                <div className="flex justify-between">
                                    <div>{work.role}</div>
                                    <div>
                                        {work.startDate} &nbsp;-&nbsp;{" "}
                                        {work.endDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* large size */}
            <div className="hidden lg:block text-primary">
                <div className=" mx-15 py-10 xl:mx-25 text-xs xl:text-sm text-color-text-hovering">
                    RECENT WORK
                </div>
                <div
                    onMouseLeave={() => {
                        handleHover("out");
                    }}
                    className="flex flex-col text-primary"
                >
                    {works.map((work, index) => {
                        return (
                            <div
                                key={work.id}
                                data-name="view"
                                onMouseEnter={() => {
                                    handleHover("enter", index);
                                }}
                                className="hover:text-color-text-hovering transition-all duration-300 ease-out hover:-translate-x-1"
                            >
                                <div className="border-t-1 border-color-text-hovering pointer duration-0 hover:translate-x-0"></div>
                                <div className="flex flex-row justify-between items-center m-10 xlmy:15 xl:mx-25 pointer-events-none hover:text-color-text-hovering transition-all duration-300 ease-out hover:-translate-y-1">
                                    <div className="flex flex-col ">
                                        <div className="text-5xl xl:text-6xl">
                                            {work.company}
                                        </div>
                                        <div className="text-lg xl:text-xl">
                                            {work.role}
                                        </div>
                                    </div>
                                    <div className="text-xs xl:text-sm">
                                        {work.startDate} &nbsp;-&nbsp;{" "}
                                        {work.endDate}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="border-t-1 border-color-text-hovering "></div>
                </div>
            </div>
            <div className="flex items- justify-center text-primary py-20">
                <div className="border px-8 py-1 text-lg flex items-center justify-center rounded-xm cursor-pointer md:cursor-none hover:border-color-text-hovering self-start ">
                    <Magnet magnetStrength={4}>
                        <TransitionLink
                            preloaderRef={preloaderRef}
                            href={"/work"}
                            label={"MORE WORK"}
                        ></TransitionLink>
                    </Magnet>
                </div>
            </div>
            {/* hovered image */}
            <div
                ref={imageContainerRef}
                className="w-[400px] h-[350px]  fixed overflow-hidden"
                style={{
                    top: `${position.y - 160}px`,
                    left: `${position.x - 180}px`,
                    pointerEvents: "none",
                }}
            >
                <div ref={imageHolderRef} className="flex flex-col">
                    {works.map((work, index) => (
                        <div className={` ${work.bgColor} w-[400px] h-[350px]`}>
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
            {/* <div
                ref={imageContainerRef}
                className={` fixed ${works[hoveredIndex].bgColor} w-[400px] h-[350px] `}
                style={{
                    // top: `${position.y - 160}px`,
                    // left: `${position.x - 180}px`,
                    top: `${222}px`,
                    left: `${222}px`,
                    pointerEvents: "none",
                }}
            >
                <div className="px-10 w-full h-full  flex items-center justify-center">
                    <img
                        src={works[hoveredIndex].img}
                        alt="certificate"
                        className="shadow-lg shadow-black"
                    />
                </div>
            </div> */}
            ;
        </div>
    );
};

export default HomeRecentWork;
