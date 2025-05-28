import React from "react";
import bgImage from "../../assets/img/bg/noise-transparent.png"; // adjust the path as needed

import PrimaryButton from "../Buttons/PrimaryButton";
import { AppContext } from "../../App";
import { useLocation } from "react-router";
import FooterSocials from "./FooterSocials";

const Footer = ({}) => {
    const { handleButtonNavigation } = React.useContext(AppContext);
    const location = useLocation();
    const isContact = location.pathname == "/contact";

    return (
        <div
            className={`h-[50vh] ${isContact && "hidden"} `}
            style={{
                clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
            }}
        >
            <div
                className="fixed  w-full h-[50vh]  bottom-0 bg-primary bg-repeat bg-center "
                style={{
                    backgroundImage: `url(${bgImage})`,
                }}
            >
                <div className="flex flex-col h-full px-12 md:px-20 lg:px-30">
                    <div className="pt-10 h-[40vh] flex flex-col gap-5  justify-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl  md:text-end ">
                        <div className="font-semibold">
                            <span className="text-background">
                                Got something in mind?{" "}
                            </span>
                            <span className="text-color-text-hovering border-b-2 border-transparent hover:text-color-text-hovering  hover:border-color-text-hovering transition-all duration-300 cursor-none">
                                <a
                                    onClick={() =>
                                        handleButtonNavigation("/contact")
                                    }
                                >
                                    Let’s talk about it.
                                </a>
                            </span>
                        </div>
                        <div className="self-start md:self-end">
                            <PrimaryButton
                                label={"GET IN TOUCH"}
                                colorStyle="text-background"
                                handleOnClick={() =>
                                    handleButtonNavigation("/contact")
                                }
                            />
                        </div>
                    </div>
                    <div className="text-background">
                        <FooterSocials />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
