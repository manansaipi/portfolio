import React, { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileAboutImg from "../../assets/img/profiles/bobenprofile.jpeg";
import graduateImg from "../../assets/img/profiles/graduate.jpg";
import Certificate from "./Certificate/Certificate";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const About = () => {
    return (
        <div className="h-[300vh] bg-light-dark text-primary p-5 pt-10">
            <div className="px-5 md:px-20 lg:px-35 xl:px-50 z-10 mb-20">
                <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                    Build digital things that work beautifully and feel easy.
                </div>

                <div className="border-t-[1px] my-15 text-color-text-hovering"></div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div>
                        <div className="text-base leading-relaxed">
                            Hey there! My name is{" "}
                            <span className="font-bold italic">
                                Abdul Mannan Saipi
                            </span>
                            . I graduated from{" "}
                            <span className="font-semibold">
                                President University
                            </span>{" "}
                            with a major in{" "}
                            <span className="italic">Informatics</span>, earning
                            a{" "}
                            <span className="font-bold">
                                GPA of 3.88 (Magna Cum Laude)
                            </span>
                            . I'm a{" "}
                            <span className="font-medium">
                                software developer
                            </span>{" "}
                            with experience in{" "}
                            <span className="italic">
                                web, mobile, and machine learning application
                                development
                            </span>
                            .
                        </div>

                        <div className="mt-5 text-color-text-hovering animate-pulse">
                            Always exploring...
                        </div>
                    </div>

                    <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
                        <img
                            src={graduateImg}
                            className="absolute top-0 left-0 w-full h-full object-cover object-[45%]"
                        />
                    </div>
                </div>
            </div>

            {/* <Certificate /> */}
        </div>
    );
};

export default About;
