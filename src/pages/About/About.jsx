import React from "react";
import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";
import { FaArrowRightLong } from "react-icons/fa6";

const About = () => {
    return (
        // <UnderDevelopment
        // 	title="About Page"
        // 	message="About me? Good question. I’m still deciding how to tell my story without sounding like a superhero origin story. "
        // />
        <>
            <div className="h-[200vh] bg-light-dark text-primary text-3xl p-5 pt-10 ">
                <div className="px-7 z-10">
                    <div className="">
                        Build digital things that work beautifully and feel
                        easy.
                    </div>
                    <div className="border-t-[1px] my-20 text-color-text-hovering"></div>
                    <FaArrowRightLong className="w-5 -mt-10 mb-5" />
                    <div className="text-sm">
                        <div>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Nostrum doloribus deleniti sapiente at aliquam
                            eaque, non totam pariatur nulla soluta.
                        </div>
                        <div className="mt-5 text-color-text-hovering animate-pulse">
                            Always exploring...
                        </div>
                    </div>
                </div>
                <div className="bg-black h-[60vh] mt-20"></div>
            </div>
        </>
    );
};

export default About;
