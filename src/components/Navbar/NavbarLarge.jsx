import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import Magnet from "../Magnet";
import { AppContext } from "../../App";
import gsap from "gsap";
const NavbarLarge = () => {
    const { handleButtonNavigation } = React.useContext(AppContext);
    const location = useLocation();
    const pathname = location.pathname;

    const nameRef = useRef();
    const navbarLargeRef = useRef();

    // Helper to determine active class
    const getLinkClass = (path) =>
        `${
            pathname.toLowerCase() === path.toLowerCase()
                ? "text-primary font-semibold"
                : "text-color-text-hovering"
        } hover:text-primary cursor-none transition-color duration-500`;
    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                nameRef.current.classList.add("z-10");
                navbarLargeRef.current.classList.add("z-10");
            },
        });
        if (location.pathname !== "/") {
            tl.fromTo(
                navbarLargeRef.current.children,
                { opacity: 0 },
                {
                    opacity: 1,
                    stagger: 0.075,
                    delay: 1,
                }
            );
        } else {
            tl.fromTo(
                navbarLargeRef.current.children,
                { opacity: 0 },
                {
                    opacity: 1,
                    stagger: 0.075,
                    delay: 7.1,
                }
            );
        }
    }, []);
    return (
        <div>
            <div id="Home" className="bg-light-dark">
                <div className=" flex text-color-text-hovering h-[20vh]  items-center px-40 xl:px-60  ">
                    {/* if sm-md screen size, the position is flex */}
                    <div className="w-full hidden  lg:flex flex-col ">
                        <div
                            ref={nameRef}
                            className="hover:text-primary cursor-none"
                        >
                            <a onClick={() => handleButtonNavigation("/")}>
                                Abdul Mannan Saipi
                            </a>
                        </div>
                    </div>
                    <div
                        ref={navbarLargeRef}
                        className="hidden lg:flex  gap-10 justify-end w-screen  overflow-hidden  "
                    >
                        <div className={getLinkClass("/about")}>
                            <Magnet>
                                <a
                                    onClick={() =>
                                        handleButtonNavigation("/about")
                                    }
                                >
                                    About
                                </a>
                            </Magnet>
                        </div>
                        <div className={getLinkClass("/work")}>
                            <Magnet>
                                <a
                                    onClick={() =>
                                        handleButtonNavigation("/work")
                                    }
                                >
                                    Work
                                </a>
                            </Magnet>
                        </div>
                        <div className={getLinkClass("/blog")}>
                            <Magnet>
                                <a
                                    onClick={() =>
                                        handleButtonNavigation("/blog")
                                    }
                                >
                                    Writing
                                </a>
                            </Magnet>
                        </div>
                        <div className={getLinkClass("/contact")}>
                            <Magnet>
                                <a
                                    onClick={() =>
                                        handleButtonNavigation("/contact")
                                    }
                                >
                                    Contact
                                </a>
                            </Magnet>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarLarge;
