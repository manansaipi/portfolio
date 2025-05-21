import React, { useRef, useLayoutEffect } from "react";
import { AnimateHeader } from "../../../components/PreLoader/AnimatePageTransition";
import works from "../../Home/HomeRecentWork/Works";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { div } from "three/tsl";
const ExperienceEntrance = () => {
    const headerContainerRef = useRef();

    useLayoutEffect(() => {
        AnimateHeader({ headerContainerRef });
    }, []);
    return (
        <div className="pb-100 bg-light-dark text-primary px-5 md:px-20 lg:px-35 xl:px-50 2xl:px-75">
            <div
                ref={headerContainerRef}
                className="flex pt-[10vh] items-center pb-[40vh] relative overflow-hidden"
            >
                <p className="custom-heading">
                    I have over 2 years of experience building digital things
                </p>
            </div>
            <div>
                {works.map((work, index) => (
                    <div
                        key={index}
                        className="mb-[15vh] lg:mb-[20vh]  flex flex-col"
                    >
                        <div data-name="view" className="group overflow-hidden">
                            <img
                                src={work.img}
                                className="w-full pointer-events-none  group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                alt=""
                            />
                        </div>
                        <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-5 lg:mt-10 mb-2 lg:mb-5  ">
                            {work.company}
                        </div>
                        <p className="mb-5 xl:text-lg 2xl:text-xl">
                            {work.desc}
                        </p>
                        <div className="self-start">
                            <PrimaryButton label={"VIEW MORE"} />
                        </div>
                    </div>
                    // TODO : we can use scroll trigger to expand what i am doing in each work instead of using another route
                ))}
            </div>
        </div>
    );
};

export default ExperienceEntrance;
