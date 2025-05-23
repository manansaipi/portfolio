import { useRef, useState, useEffect, useLayoutEffect } from "react";
import ContactForm from "./ContactForm/ContactForm";
import Magnet from "../../components/Magnet";
import { LuGithub } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { PiLinkedinLogoBold } from "react-icons/pi";
import { AnimateHeader } from "../../components/PreLoader/AnimatePageTransition";
import FooterSocials from "../../components/Footer/FooterSocials";

const Contact = () => {
    const headerContainerRef = useRef();

    useLayoutEffect(() => {
        AnimateHeader({ headerContainerRef });
    }, []);

    return (
        <div className="bg-light-dark text-primary ">
            <div className=" p-5 md:px-20 lg:px-35 xl:px-50 2xl:px-75 z-10">
                <div className="custom-heading pb-5 overflow-hidden ">
                    <div ref={headerContainerRef} className="relative z-7 ">
                        <div>
                            Feel free to reach out through the form or my
                            socials below.
                        </div>
                    </div>
                </div>

                <ContactForm />
            </div>
            <div className="px-12 md:px-20 lg:px-30">
                <FooterSocials />
            </div>
        </div>
    );
};

export default Contact;
// https://aafrzl.my.id/ contact refference
// TODO : VALIDASI EMAIL SENDER SPAMMING. CANNOT SEND TWO TIMES OR MORE
