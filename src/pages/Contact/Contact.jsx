import { useRef, useState, useEffect } from "react";
import bgImage from "../../assets/img/bg/noise-transparent.png"; // adjust the path as needed
import Lanyard from "./Lanyard";
import MessageForm from "./MessageForm";
import FooterContact from "./FooterContact";
import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";
import CustomCursor from "../../components/CustomCursor";
const Contact = () => {
    const [visible, setVisible] = useState(false);
    const lanyardRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect(); // stop observing once loaded
                }
            },
            { threshold: 1 }
        );

        if (lanyardRef.current) observer.observe(lanyardRef.current);
    }, []);

    return (
        // <UnderDevelopment
        // 	title="Contact Page"
        // 	message="Still teaching my contact form to not ghost people."
        // />

        <div
            id="Contact"
            className="h-[80vh] cursor-none text-primary"
            style={{
                clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
            }}
        >
            <div
                className="fixed w-full h-[80vh] bottom-0 bg-light-dark bg-repeat bg-center "
                // style={{
                //     backgroundImage: `url(${bgImage})`,
                // }}
            >
                <div className="flex flex-col lg:flex-row ">
                    <div
                        ref={lanyardRef}
                        className="h-[80vh] lg:w-full hidden md:flex md:items-center justify-center   "
                    >
                        {visible ? (
                            <div className="h-full w-[45vh] lg:w-full">
                                <Lanyard
                                    position={[0, 0, 15]}
                                    gravity={[0, -40, 0]}
                                />
                            </div>
                        ) : (
                            <div />
                        )}
                    </div>
                    <div className="h-[80vh] w-full p-12">
                        <MessageForm />
                    </div>
                </div>
                {/* <div className="h-[80vh] "></div> */}
                <div className="h-[20vh] ">
                    <FooterContact />
                </div>
            </div>
            <CustomCursor />
        </div>
    );
};

export default Contact;
// https://aafrzl.my.id/ contact refference
// TODO : VALIDASI EMAIL SENDER SPAMMING. CANNOT SEND TWO TIMES OR MORE
