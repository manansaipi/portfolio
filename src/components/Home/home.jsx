import React, { useEffect, useState, useRef, useMemo } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

const Home = () => {
    const greetginsRef = useRef();
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
        "Hallo",
        "Hei",
        "Olá",
        "안녕",
        "你好",
        "Ciao",
    ];
    const [currentGreeting, setCurrentGreeting] = useState(greetings[0]);
    const greetingIndex = useRef(0);

    const randomGreeting = useMemo(() => {
        return greetings[Math.floor(Math.random() * greetings.length)];
    }, []);

    useEffect(() => {
        const vw = window.innerWidth;

        let yOffset = 0;
        let yToOffset = 0;
        let rotateZvar = 25;

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
                delay: 1,
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
                delay: 2,
                duration: 0.8,
            })
            .to(softwareRef.current, { y: 0, rotateZ: 0 }, "-=0.5")
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
                    onComplete: () => {
                        if (greetginsRef.current) {
                            setTimeout(() => {
                                if (greetginsRef.current) {
                                    greetginsRef.current.classList.replace(
                                        "z-6",
                                        "z-2"
                                    );
                                }
                            }, 2000); // wait 2000ms before changing z-index to avoid blinking
                        }
                    },
                },
                "-=0.6"
            )
            .to(greetginsRef.current, { z: 0 });

        const interval = setInterval(() => {
            const nextGreeting =
                greetings[(greetingIndex.current + 1) % greetings.length];

            if (ciaoRef.current) {
                const tl = gsap.timeline();

                // Step 1: Animate the current word up and out
                tl.to(ciaoRef.current, {
                    y: -50,
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        // After the word is hidden, update the greeting
                        greetingIndex.current =
                            (greetingIndex.current + 1) % greetings.length;
                        setCurrentGreeting(nextGreeting);
                        gsap.set(ciaoRef.current, { y: 100 }); // reset position below
                    },
                });

                // Step 2: Animate the new word in from the bottom
                tl.to(ciaoRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                });
            }
        }, 12000); // change every 12 seconds

        window.addEventListener("resize", handleResize);

        // Call once to check initial width
        handleResize();

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        // ->60vh
        <section className="h-[60vh] bg-light-dark flex flex-col  items-start text-2xl text-primary pl-15 md:px-40 md:text-3xl lg:px-66 lg:text-4xl xl:px-110 xl:text-5xl">
            <div className="h-[23vh]"></div>
            {/* TODO : FIX OVERFLOW WITH NAVBAR */}
            <div
                ref={greetginsRef}
                className="flex flex-col w-full z-6 will-change-auto "
            >
                {/* overflow-hidden */}
                <div className="flex gap-2 lg:gap-3  overflow-hidden ">
                    <div className="w-15 md:w-18 lg:w-21 xl:w-29" ref={ciaoRef}>
                        {currentGreeting},
                    </div>
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
                                simplifies complexity.
                            </span>
                            <span className="absolute" ref={simpleRef}>
                                loves building things.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
