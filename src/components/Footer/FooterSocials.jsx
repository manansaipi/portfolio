import React from "react";
import { LuGithub } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { PiLinkedinLogoBold } from "react-icons/pi";
import Magnet from "../Magnet";

const FooterSocials = () => {
    return (
        <div className="flex justify-between items-center h-[10vh]">
            <div className="text-sm md:flex md:gap-5 md:text-md lg:text-lg lg:gap-10 ">
                <div>Made in Jakarta, Indonesia</div>
                <div>&copy; 2025 Ben</div>
            </div>
            <div className="flex gap-5 md:gap-7 lg:gap-9">
                <Magnet magnetStrength={3} padding={15}>
                    <a
                        href="https://www.linkedin.com/in/abdulmannansaipi"
                        target="_blank"
                        className="cursor-none hover:text-color-text-hovering"
                    >
                        <PiLinkedinLogoBold className="  size-5 md:size-6 lg:size-7 pointer-events-none " />
                    </a>
                </Magnet>
                <Magnet magnetStrength={3} padding={15}>
                    <a
                        href="https://github.com/manansaipi"
                        target="_blank"
                        className="cursor-none hover:text-color-text-hovering"
                    >
                        <LuGithub className="  size-5 md:size-6 lg:size-7 pointer-events-none" />
                    </a>
                </Magnet>
                <Magnet magnetStrength={3} padding={15}>
                    <a
                        href="https://www.instagram.com/manansaipi"
                        target="_blank"
                        className="cursor-none hover:text-color-text-hovering"
                        
                    >
                        <FaInstagram className="  size-5 md:size-6 lg:size-7 pointer-events-none" />
                    </a>
                </Magnet>
            </div>
        </div>
    );
};

export default FooterSocials;
