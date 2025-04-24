import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

const Home = () => {
    const ciaoRef = useRef();
    const imRef = useRef();
    const benRef = useRef();
    const doingRef = useRef();
    const techRef = useRef();
    const softwareRef = useRef();
    const whoRef = useRef();
    const lovesRef = useRef();
    const simpleRef = useRef();

    const greetings = [
        "Ciao",
        "Hello",
        "Hola",
        "Salut",
        "Hallo",
        "Hei",
        "Merhaba",
        "Olá",
        "안녕",
        "こんにちは",
        "你好",
        "Ciao",
    ];
    const randomGreeting = useMemo(() => {
        return greetings[Math.floor(Math.random() * greetings.length)];
    }, []);

    useEffect(() => {
        const vw = window.innerWidth;

        let yOffset = 0;
        let yToOffset = 0;
        let rotateZvar = 20;

        const handleResize = () => {
            if (vw < 640) {
                yOffset = 80;
                yToOffset = -50 - 35;
            } else if (vw < 1024) {
                yOffset = 95;
                yToOffset = -65 - 35;
            } else if (vw < 1280) {
                yOffset = 110;
                yToOffset = -80 - 35;
            } else {
                yOffset = 125;
                yToOffset = -95 - 35;
            }
            console.log("kon");
        };
        handleResize(); // Call once initially

        gsap.set(ciaoRef.current, { y: yOffset, rotateZ: rotateZvar });
        gsap.set(imRef.current, { y: yOffset, rotateZ: rotateZvar });
        gsap.set(benRef.current, { y: yOffset, rotateZ: rotateZvar });
        gsap.set(doingRef.current, { y: yOffset, rotateZ: 3 });
        gsap.set(softwareRef.current, { y: yOffset, rotateZ: 3 });
        gsap.set(whoRef.current, { y: yOffset, rotateZ: 3 });
        gsap.set(simpleRef.current, { y: yOffset, rotateZ: 3 });

        const tl = gsap.timeline();

        tl.to(ciaoRef.current, { y: 0, duration: 0.35, rotateZ: 0, delay: 0.5 })
            .to(imRef.current, {
                y: 0,
                rotateZ: 0,
                duration: 0.35,
                delay: 0.35,
            })
            .to(
                benRef.current,
                {
                    y: 0,
                    rotateZ: 0,
                    duration: 0.53,
                },
                "-=0.4"
            )
            .to(doingRef.current, {
                y: 0,
                rotateZ: 0,
                duration: 0.6,
            })
            .to(
                whoRef.current,
                {
                    y: 0,
                    rotateZ: 0,
                    duration: 0.8,
                },
                "-=0.5"
            )
            .to(techRef.current, {
                y: yToOffset,
                rotateZ: -10,
                delay: 2.5,
                duration: 0.8,
            })
            .to(softwareRef.current, { y: 0, rotateZ: 0 }, "-=0.75")
            .to(
                lovesRef.current,
                {
                    y: yToOffset,
                    rotateZ: -10,
                    duration: 0.8,
                },
                "-=0.6"
            )
            .to(
                simpleRef.current,
                {
                    y: 0,
                    rotateZ: 0,
                },
                "-=0.75"
            );

        window.addEventListener("resize", handleResize);

        // Call once to check initial width
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        <section
            id="Home"
            className=" h-svh bg-light-dark flex flex-col  items-start text-2xl text-primary px-10 md:px-20 md:text-3xl lg:px-56 lg:text-4xl xl:px-96 xl:text-5xl"
        >
            <div className="h-1/4"></div>
            <div className="flex flex-col w-full ">
                {/* overflow-hidden */}
                <div className="flex gap-2 lg:gap-3  overflow-hidden ">
                    {/* <div className="flex gap-2 lg:gap-3 bg-red-50 md:bg-yellow-100 lg:bg-blue-300 xl:bg-green-200   "> */}
                    <div ref={ciaoRef}>{randomGreeting}, </div>
                    <div ref={imRef}>I'm </div>
                    <div ref={benRef}>Ben.</div>
                </div>
                {/* overflow-hidden */}
                <div className="text-color-text-hovering flex gap-2 lg:gap-3 overflow-hidden xl:h-13 ">
                    <div
                        ref={doingRef}
                        className="flex  w-full gap-2 lg:gap-3 "
                    >
                        <span>I'm a</span>
                        <div className=" ">
                            <span className="absolute" ref={techRef}>
                                tech enthusiast
                            </span>
                            <span className="absolute" ref={softwareRef}>
                                software engineer
                            </span>
                        </div>
                    </div>
                </div>
                {/* overflow-hidden */}
                <div className="text-color-text-hovering overflow-hidden">
                    <div
                        ref={whoRef}
                        className="flex w-full gap-2 lg:gap-3 xl:h-13  "
                    >
                        <span>who</span>
                        <div className="">
                            <span className="absolute" ref={lovesRef}>
                                loves building things.
                            </span>
                            <span className="absolute" ref={simpleRef}>
                                simplifies complexity
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
