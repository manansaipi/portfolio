import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const Entrance = () => {
    const abdul = useRef();
    const bdul = useRef();
    const mannan = useRef();
    const annan = useRef();
    const saipi = useRef();
    const aipi = useRef();
    const portfolio = useRef();

    const wrapper = useRef();

    useEffect(() => {
        const vw = window.innerWidth;

        let yOffset = 100;
        let xOffset = 100;

        if (vw < 640) {
            // small screens (like mobile)
            yOffset = 50;
            xOffset = 75;
        } else if (vw < 1024) {
            // medium screens (tablet)
            yOffset = 50;
            xOffset = 120;
        } else {
            // large screens (desktop)
            yOffset = 100;
            xOffset = 175;
        }

        const firstTl = gsap.timeline();
        const secondTl = gsap.timeline();
        const thirdTl = gsap.timeline();

        gsap.set(abdul.current, { y: yOffset, x: xOffset });
        gsap.set(mannan.current, { y: -yOffset });
        gsap.set(saipi.current, { y: yOffset, x: -xOffset });
        gsap.set(portfolio.current, { y: yOffset });

        firstTl
            .to(abdul.current, { y: 0, duration: 0.5, ease: "power3.out" })
            .to(abdul.current, {
                x: 0,
                duration: 0.5,
                delay: 0.5,
                ease: "power3.out",
            });

        thirdTl
            .to(mannan.current, {
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                delay: 1.15,
            })
            .to([bdul.current, annan.current, aipi.current], {
                opacity: 1,
                duration: 1,
                text: "",
            })
            .to(wrapper.current, {
                gap: 0,
                duration: 0.7,
            })
            .to(portfolio.current, {
                y: 0,
                onStart: () => {
                    portfolio.current.classList.remove("hidden");
                    portfolio.current.classList.add("visible");
                },
            });

        secondTl
            .to(saipi.current, {
                y: 0,
                duration: 0.5,
                delay: 0.5,
                ease: "power3.out",
            })
            .to(saipi.current, { x: 0, duration: 0.5, ease: "power3.out" });
    }, []);

    return (
        <div
            id="Entrance"
            className="section bg-background text-primary flex items-center justify-center text-3xl font-normal md:text-5xl lg:text-7xl "
        >
            <div
                ref={wrapper}
                className="w-full flex items-center justify-center gap-5 overflow-hidden md:gap-8 lg:gap-10 "
            >
                <div className="font-luckiestguy flex italic" ref={abdul}>
                    A <div ref={bdul}>BDUL</div>
                </div>
                <div className="font-luckiestguy flex italic" ref={mannan}>
                    M <div ref={annan}>ANNAN</div>
                </div>
                <div className="font-luckiestguy flex italic" ref={saipi}>
                    S <div ref={aipi}>AIPI</div>°
                </div>
                <div ref={portfolio} className="font-bold hidden ">
                    &nbsp; Portfolio
                </div>
            </div>
        </div>
    );
};
// https://www.sublimio.com/ refference good entrance
// https://www.reactbits.dev/

export default Entrance;
