import React, { useRef, useState, useEffect } from "react";
import TogleTheme from "./TogleThemeButton";
import Logo from "./Logo";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
gsap.registerEase(CustomEase);

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navbarRef = useRef();
    const navigationListRef = useRef();
    const socialMediaRef = useRef();
    const leftTextNavbarOpenRef = useRef();

    const logo = useRef();

    const handleOpenNavbar = () => {
        setIsOpen(!isOpen);

        if (!isOpen) {
            // open navbar
            navbarRef.current.style.display = "flex";
            gsap.fromTo(
                navbarRef.current,
                { y: -500 },
                {
                    y: 0,
                    duration: 1,
                    ease: "power4.out",
                }
            );

            // animate navList
            gsap.set(navigationListRef.current.children, { y: 100 });
            gsap.to(navigationListRef.current.children, {
                y: 0,
                duration: 0.5,
                stagger: 0.075,
            });
            // animate left text opened navbar
            gsap.set(leftTextNavbarOpenRef.current.children, { y: 100 });
            gsap.to(leftTextNavbarOpenRef.current.children, {
                y: 0,
                duration: 0.75,
                stagger: 0.075,
            });

            // animate social media
            gsap.set(socialMediaRef.current.children, { y: 50 });
            gsap.to(socialMediaRef.current.children, {
                y: 0,
                duration: 0.5,
                stagger: 0.075,
                delay: 0.3,
            });

            // hiding logo
            gsap.fromTo(
                logo.current,
                {
                    opacity: 1,
                },
                {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power1.in",
                }
            );
        } else {
            // close navbar
            gsap.to(navbarRef.current, {
                y: -500,
                duration: 1.2,
                ease: CustomEase.create(
                    "custom",
                    "M0,0 C0.11,0.494 0.3,0.6 0.33,0.6 0.35,0.6 0.37,0.6 0.38,0.6 0.39,0.6 0.41,0.6 0.43,0.6 0.45,0.6 0.47,0.6 0.49,0.6 0.51,0.6 0.55,0.6 0.58,0.65 0.6 ,0.7 0.65,0.75 0.7,0.85 0.9,0.9 0.9,1 1,1 "
                ),
                onComplete: () => {
                    // hide the navbar if the navbar completely closed
                    if (
                        navbarRef.current.style.display ==
                        "translate(0px, -500px)"
                    ) {
                        navbarRef.current.style.display = "none";
                    }
                },
            });
            gsap.to(logo.current, {
                opacity: 1,
                duration: 0.3,
            });
        }
    };
    const vw = window.innerWidth;

    useState(() => {});
    // Click-outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen && // when user click and vabar is open
                navbarRef.current &&
                !navbarRef.current.contains(event.target) && // when user click and it not contain navbar
                !event.target.closest(".open-navbar-button") &&
                !logo.current.contains(event.target)
            ) {
                handleOpenNavbar();
            }
        };

        let resizeTimer;

        // close the navbar when user resizing the the screen to large size
        const handleResize = () => {
            clearTimeout(resizeTimer); // Clear the previous timeout
            resizeTimer = setTimeout(() => {
                const vw = window.innerWidth;
                if (vw > 1024 && isOpen) {
                    handleOpenNavbar();
                }
            }, 300); // Wait 300ms after the last resize
        };

        window.addEventListener("resize", handleResize);

        // Call once to check initial width
        handleResize();

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleResize);
        };
    }, [isOpen]);
    return (
        <>
            {/* OPENED NAVBAR */}
            <div
                ref={navbarRef}
                className={`flex bg-primary w-full fixed  z-22 `}
                style={{ display: "none" }}
            >
                <div
                    ref={leftTextNavbarOpenRef}
                    className="p-5 h-[5rem]  w-1/2 hidden  md:flex md:flex-col overflow-hidden "
                >
                    <a className=" font-bold text-background text-xl">
                        Abdul Mannan Saip
                    </a>
                    <a className=" font-bold text-background text-xl ">
                        Portfolio
                    </a>
                </div>
                <div className=" flex flex-col  justify-center items-start bg-primary pl-5 pt-14 mb-8  md:pt-5 md:pl-3  ">
                    <div
                        ref={navigationListRef}
                        className="flex flex-col gap-0 font-bold text-6xl text-background overflow-hidden mb-7 md:mb-8 "
                    >
                        <a
                            onClick={handleOpenNavbar}
                            href="#Home"
                            className="hover:text-color-text-hovering -mb-2 cursor-none"
                        >
                            HOME
                        </a>
                        <a
                            onClick={handleOpenNavbar}
                            href="#About"
                            className="hover:text-color-text-hovering -mb-2 cursor-none"
                        >
                            ABOUT
                        </a>
                        <a className=" -mb-2 ">EXPERIENCE</a>
                        <a className=" -mb-2 ">CONTACT</a>
                    </div>
                    <div className="h-15"></div>
                    <div
                        ref={socialMediaRef}
                        className="flex gap-5 font-bold text-background text-xl  overflow-hidden "
                    >
                        <a
                            target="_blank"
                            href="https://www.linkedin.com/in/abdulmannansaipi"
                            className="hover:text-color-text-hovering cursor-none"
                        >
                            LinkedIn
                        </a>
                        <a
                            target="_blank"
                            href="https://github.com/manansaipi"
                            className="hover:text-color-text-hovering cursor-none"
                        >
                            GitHub
                        </a>
                        <a
                            target="_blank"
                            href="https://www.instagram.com/manansaipi"
                            className="hover:text-color-text-hovering cursor-none"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
            {/* NAVBAR LARGE */}
            <div className="bg-light-dark">
                <div className=" flex text-primary h-44 items-center px-48 xl:px-80  ">
                    {/* if sm-md screen size, the position is flex */}
                    <div
                        ref={logo}
                        className={`fixed lg:static top-3.5 left-5  mix-blend-difference  `}
                    >
                        <Logo></Logo>
                    </div>
                    <div className="hidden lg:flex gap-10 justify-end w-full text- ">
                        <a
                            href="#Home"
                            className="hover:text-color-text-hovering cursor-none"
                        >
                            Home
                        </a>
                        <a
                            href="#About"
                            className="hover:text-color-text-hovering cursor-none"
                        >
                            About
                        </a>
                        <a className="">Experience</a>
                        <a className="">Contact</a>
                    </div>
                </div>
            </div>
            <a
                onClick={handleOpenNavbar}
                className={`open-navbar-button fixed top-3.5 right-3.5 ${
                    isOpen ? "text-background" : "text-primary"
                }  hover:text-color-text-hovering  text-xl font-bold z-10 lg:hidden   `}
            >
                {isOpen ? "Close" : "Menu"}
            </a>
        </>
    );
};

export default Navbar;
